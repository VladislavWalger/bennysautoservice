<?php
// HU-Erinnerung: Anmeldung (POST), Bestätigung und Abmeldung (GET mit Token).
declare(strict_types=1);
require __DIR__ . '/lib.php';

header('X-Robots-Tag: noindex');
$wantsJson = ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'fetch';

function respond(bool $ok, string $message, int $status = 200): never
{
    global $wantsJson;
    if ($wantsJson) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
        exit;
    }
    redirect($ok ? '/hu-erinnerung/gesendet/' : '/hu-erinnerung/fehler/');
}

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    // ---- Bestätigen / Abmelden per Link aus der E-Mail
    if ($method === 'GET') {
        $token = (string) ($_GET['token'] ?? '');
        $action = (string) ($_GET['action'] ?? '');
        if (!preg_match('/^[a-f0-9]{48}$/', $token)) {
            redirect('/hu-erinnerung/fehler/');
        }
        if ($action === 'confirm') {
            $stmt = db()->prepare("UPDATE reminders SET status = 'active', confirmed_at = COALESCE(confirmed_at, ?) WHERE token = ?");
            $stmt->execute([now(), $token]);
            redirect($stmt->rowCount() ? '/hu-erinnerung/bestaetigt/' : '/hu-erinnerung/fehler/');
        }
        if ($action === 'unsubscribe') {
            db()->prepare('DELETE FROM reminders WHERE token = ?')->execute([$token]);
            redirect('/hu-erinnerung/abgemeldet/');
        }
        redirect('/hu-erinnerung/');
    }

    if ($method !== 'POST') {
        http_response_code(405);
        exit;
    }

    // ---- Anmeldung
    if (trim((string) ($_POST['website'] ?? '')) !== '') {
        respond(true, 'Danke!'); // Honeypot: Bots bekommen eine scheinbare Erfolgsmeldung
    }

    $plate = mb_strtoupper(trim(preg_replace('/\s+/', ' ', (string) ($_POST['kennzeichen'] ?? ''))));
    $name = trim(mb_substr(strip_tags((string) ($_POST['name'] ?? '')), 0, 80));
    $email = trim((string) ($_POST['email'] ?? ''));
    $month = (int) ($_POST['monat'] ?? 0);
    $year = (int) ($_POST['jahr'] ?? 0);
    $consent = ($_POST['einwilligung'] ?? '') !== '';

    if (!preg_match('/^[A-ZÄÖÜ]{1,3}[- ]?[A-Z]{1,2}[- ]?[0-9]{1,4}[EH]?$/u', $plate)) {
        respond(false, 'Bitte geben Sie ein gültiges Kennzeichen ein, z. B. RD-AB 123.', 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
        respond(false, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.', 422);
    }
    if (!$consent) {
        respond(false, 'Bitte stimmen Sie der Verarbeitung Ihrer Daten zu.', 422);
    }
    $thisMonth = new DateTimeImmutable('first day of this month 00:00');
    $due = DateTimeImmutable::createFromFormat('!Y-n-j', "$year-$month-1");
    if (!$due || $month < 1 || $month > 12 || $due < $thisMonth || $due > $thisMonth->modify('+36 months')) {
        respond(false, 'Bitte wählen Sie den Monat, in dem Ihre HU fällig ist.', 422);
    }
    $dueMonth = $due->format('Y-m');

    // Einfache Begrenzung gegen Missbrauch: max. 10 Anmeldungen pro Stunde und IP
    $ipHash = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . __DIR__);
    $stmt = db()->prepare('SELECT COUNT(*) FROM reminders WHERE ip_hash = ? AND created_at > ?');
    $stmt->execute([$ipHash, (new DateTimeImmutable('-1 hour'))->format('Y-m-d H:i:s')]);
    if ((int) $stmt->fetchColumn() >= 10) {
        respond(false, 'Zu viele Anfragen. Bitte versuchen Sie es später noch einmal.', 429);
    }

    // Gleiche Kombination aus E-Mail und Kennzeichen ersetzt einen älteren Eintrag
    db()->prepare('DELETE FROM reminders WHERE lower(email) = lower(?) AND plate = ?')->execute([$email, $plate]);

    $token = bin2hex(random_bytes(24));
    db()->prepare('INSERT INTO reminders (token, plate, name, email, due_month, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        ->execute([$token, $plate, $name, $email, $dueMonth, $ipHash, now()]);

    $hello = $name !== '' ? "Hallo $name," : 'Guten Tag,';
    $label = month_label($dueMonth);
    $confirmUrl = url('/api/hu-erinnerung.php?action=confirm&token=' . $token);
    $unsubscribeUrl = url('/api/hu-erinnerung.php?action=unsubscribe&token=' . $token);
    $body = <<<TXT
    $hello

    Sie möchten an die Hauptuntersuchung (HU) für Ihr Fahrzeug erinnert werden:

      Kennzeichen: $plate
      HU fällig:   $label

    Bitte bestätigen Sie Ihre Anmeldung mit einem Klick auf diesen Link:
    $confirmUrl

    Erst nach der Bestätigung wird die Erinnerung aktiv. Haben Sie diese Anmeldung nicht selbst vorgenommen,
    ignorieren Sie diese E-Mail einfach – die Daten werden dann automatisch gelöscht.

    Sie können die Erinnerung jederzeit abbestellen:
    $unsubscribeUrl

    Viele Grüße
    Ihr Team von Benny´s Autoservice
    TXT;

    if (!send_mail($email, "Bitte bestätigen: HU-Erinnerung für $plate", $body)) {
        db()->prepare('DELETE FROM reminders WHERE token = ?')->execute([$token]);
        respond(false, 'Die E-Mail konnte nicht versendet werden. Bitte versuchen Sie es später erneut oder rufen Sie uns an.', 500);
    }

    respond(true, 'Fast geschafft! Wir haben Ihnen eine E-Mail geschickt – bitte bestätigen Sie darin Ihre Anmeldung.');
} catch (Throwable $e) {
    error_log('HU-Erinnerung: ' . $e->getMessage());
    respond(false, 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder rufen Sie uns an.', 500);
}
