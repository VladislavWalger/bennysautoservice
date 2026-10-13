<?php
// Einstellungen für die HU-Erinnerung. Diese Datei wird nicht öffentlich ausgeliefert (siehe .htaccess).
return [
    // Öffentliche Adresse der Website (ohne Schrägstrich am Ende) – wird für Links in E-Mails benutzt
    'site_url' => 'https://www.bennys-autoservice.de',

    // Absender der E-Mails. Muss eine Adresse der eigenen Domain sein, sonst landen Mails im Spam.
    'mail_from' => 'info@bennys-autoservice.de',
    'mail_from_name' => 'Benny´s Autoservice',

    // Optional: Kopie jeder versendeten HU-Erinnerung an die Werkstatt (leer = keine Kopie)
    'notify_email' => '',

    // 'mail' = PHP mail() des Webspace, 'log' = nur in data/mail.log schreiben (zum Testen)
    'mail_transport' => 'mail',

    // Erinnerung so viele Tage vor dem 1. des HU-Monats verschicken
    'remind_days_before' => 7,

    // Unbestätigte Anmeldungen nach so vielen Tagen löschen
    'pending_days' => 7,

    // Speicherort der Datenbank. Am besten außerhalb des öffentlichen Webordners, z. B. __DIR__ . '/../../hu-data'
    'data_dir' => __DIR__ . '/data',

    // Geheimer Schlüssel, falls der Cronjob per URL aufgerufen werden muss (leer = nur per Kommandozeile).
    // Beispiel: https://www.bennys-autoservice.de/api/cron-hu-erinnerung.php?key=DEIN-SCHLUESSEL
    'cron_key' => '',

    'timezone' => 'Europe/Berlin',
];
