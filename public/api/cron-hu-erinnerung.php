<?php
// Verschickt fällige HU-Erinnerungen und räumt alte Daten auf.
// Einmal täglich per Cronjob ausführen:  php /pfad/zu/api/cron-hu-erinnerung.php
declare(strict_types=1);
require __DIR__ . '/lib.php';

$key = (string) cfg('cron_key');
if (PHP_SAPI !== 'cli' && ($key === '' || !hash_equals($key, (string) ($_GET['key'] ?? '')))) {
    http_response_code(403);
    exit('Forbidden');
}
if (PHP_SAPI !== 'cli') {
    header('Content-Type: text/plain; charset=utf-8');
}

$today = new DateTimeImmutable('today');
$pdo = db();

// Unbestätigte Anmeldungen löschen
$stmt = $pdo->prepare("DELETE FROM reminders WHERE status = 'pending' AND created_at < ?");
$stmt->execute([$today->modify('-' . (int) cfg('pending_days') . ' days')->format('Y-m-d H:i:s')]);
$deletedPending = $stmt->rowCount();

$sent = 0;
$expired = 0;
$failed = 0;
$rows = $pdo->query("SELECT * FROM reminders WHERE status = 'active'")->fetchAll();

foreach ($rows as $r) {
    $due = DateTimeImmutable::createFromFormat('!Y-m-d', $r['due_month'] . '-01');
    $sendFrom = $due->modify('-' . (int) cfg('remind_days_before') . ' days');
    $dueEnd = $due->modify('last day of this month');

    if ($today > $dueEnd) {
        // HU-Monat ist vorbei (z. B. Cronjob lief nicht) – nichts mehr schicken, Daten löschen
        $pdo->prepare('DELETE FROM reminders WHERE id = ?')->execute([$r['id']]);
        $expired++;
        continue;
    }
    if ($today < $sendFrom) {
        continue;
    }

    $label = month_label($r['due_month']);
    $hello = $r['name'] !== '' ? "Hallo {$r['name']}," : 'Guten Tag,';
    $body = <<<TXT
    $hello

    die Hauptuntersuchung (HU) für Ihr Fahrzeug mit dem Kennzeichen {$r['plate']} ist im $label fällig.

    Der TÜV ist montags, mittwochs und freitags direkt bei uns in der Werkstatt –
    vereinbaren Sie einfach einen Termin:

      Telefon: 04331-4408244
      E-Mail:  info@bennys-autoservice.de

    Gern prüfen wir Ihr Fahrzeug vorab und beheben eventuelle Mängel, damit die HU reibungslos klappt.

    Diese Erinnerung war einmalig. Ihre Daten haben wir mit dem Versand gelöscht.

    Viele Grüße
    Ihr Team von Benny´s Autoservice
    TXT;

    if (send_mail($r['email'], "Ihre HU ist im $label fällig – {$r['plate']}", $body)) {
        $pdo->prepare('DELETE FROM reminders WHERE id = ?')->execute([$r['id']]);
        $sent++;
        $notify = (string) cfg('notify_email');
        if ($notify !== '') {
            send_mail($notify, "HU-Erinnerung verschickt: {$r['plate']} ($label)",
                "Erinnerung verschickt an: {$r['name']} <{$r['email']}>\nKennzeichen: {$r['plate']}\nHU fällig: $label");
        }
    } else {
        $failed++;
    }
}

echo "HU-Erinnerung: $sent verschickt, $failed fehlgeschlagen, $expired abgelaufen, $deletedPending unbestätigte gelöscht\n";
