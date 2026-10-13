<?php
declare(strict_types=1);

$GLOBALS['hu_config'] = require __DIR__ . '/config.php';
date_default_timezone_set(cfg('timezone'));

function cfg(string $key): mixed
{
    return $GLOBALS['hu_config'][$key] ?? null;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo) {
        return $pdo;
    }
    $dir = cfg('data_dir');
    if (!is_dir($dir)) {
        mkdir($dir, 0700, true);
    }
    $pdo = new PDO('sqlite:' . $dir . '/hu-erinnerung.sqlite');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec(<<<'SQL'
        CREATE TABLE IF NOT EXISTS reminders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT NOT NULL UNIQUE,
            plate TEXT NOT NULL,
            name TEXT NOT NULL DEFAULT '',
            email TEXT NOT NULL,
            due_month TEXT NOT NULL,                -- Format JJJJ-MM
            status TEXT NOT NULL DEFAULT 'pending', -- pending | active
            ip_hash TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL,
            confirmed_at TEXT
        )
        SQL);
    return $pdo;
}

function now(): string
{
    return (new DateTimeImmutable())->format('Y-m-d H:i:s');
}

function url(string $path): string
{
    return rtrim((string) cfg('site_url'), '/') . $path;
}

function month_label(string $dueMonth): string
{
    static $names = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    [$y, $m] = array_map('intval', explode('-', $dueMonth));
    return $names[$m - 1] . ' ' . $y;
}

function send_mail(string $to, string $subject, string $body): bool
{
    $fromName = mb_encode_mimeheader((string) cfg('mail_from_name'), 'UTF-8', 'Q');
    $from = (string) cfg('mail_from');
    $headers = [
        'From' => "$fromName <$from>",
        'Reply-To' => $from,
        'MIME-Version' => '1.0',
        'Content-Type' => 'text/plain; charset=UTF-8',
        'Content-Transfer-Encoding' => '8bit',
        'X-Mailer' => 'bennys-autoservice-hu',
    ];
    $body .= "\n\n-- \nBenny´s Autoservice · Kfz-Meisterwerkstatt\nWollinstraße 4 · 24782 Büdelsdorf\nTelefon 04331-4408244 · " . url('/') . "\n";

    if (cfg('mail_transport') === 'log') {
        $line = str_repeat('=', 60) . "\n" . now() . "\nTo: $to\nSubject: $subject\n\n$body\n";
        return file_put_contents(cfg('data_dir') . '/mail.log', $line, FILE_APPEND | LOCK_EX) !== false;
    }
    $encodedSubject = mb_encode_mimeheader($subject, 'UTF-8', 'Q');
    return mail($to, $encodedSubject, $body, $headers, '-f' . $from);
}

function redirect(string $path): never
{
    header('Location: ' . $path, true, 303);
    exit;
}
