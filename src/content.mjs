// Zentrale Inhalte der Website. Texte stammen von der bisherigen Seite
// bennys-autoservice.de und wurden nur behutsam gekürzt bzw. gegliedert.

export const site = {
  name: "Benny´s Autoservice",
  claim: "Ihre Kfz-Meisterwerkstatt in Büdelsdorf",
  url: "https://www.bennys-autoservice.de",
  owner: "Benjamin Erbst",
  street: "Wollinstraße 4",
  zip: "24782",
  city: "Büdelsdorf",
  phone: "04331-4408244",
  phoneHref: "tel:+4943314408244",
  email: "info@bennys-autoservice.de",
  vatId: "DE 355 570 028",
  mapsUrl: "https://maps.app.goo.gl/HeCJJCqFiVjGj9b77",
  facebookUrl: "https://www.facebook.com/profile.php?id=61558002424388",
};

// day: 0 = Sonntag … 6 = Samstag (wie Date#getDay)
export const hours = [
  { label: "Montag", day: 1, open: "08:00", close: "17:00" },
  { label: "Dienstag", day: 2, open: "08:00", close: "17:00" },
  { label: "Mittwoch", day: 3, open: "08:00", close: "17:00" },
  { label: "Donnerstag", day: 4, open: "08:00", close: "17:00" },
  { label: "Freitag", day: 5, open: "08:00", close: "15:30" },
  { label: "Samstag", day: 6 },
  { label: "Sonntag", day: 0 },
];

export const huNote = "TÜV im Haus: Montag, Mittwoch und Freitag – nach Vereinbarung";

export const highlights = [
  { icon: "badge-check", title: "Kfz-Meisterbetrieb", text: "Geprüfte Qualität und regelmäßige Weiterbildung" },
  { icon: "car", title: "Alle Marken", text: "Pkw, Transporter, Wohnmobile & Anhänger" },
  { icon: "gauge", title: "4 Hebebühnen", text: "Schneller, unkomplizierter Service" },
  { icon: "car-front", title: "Leihwagen", text: "Bleiben Sie mobil während der Reparatur" },
];

export const services = [
  {
    slug: "inspektion",
    icon: "wrench",
    title: "Inspektion & Ölwechsel",
    teaser: "Nach Herstellervorgaben – für Werterhalt und Sicherheit.",
    headline: "Inspektion und Ölwechsel nach Herstellervorgaben",
    body: `
<p>Die regelmäßige Inspektion Ihres Kfz dient der Werterhaltung und der Erkennung verborgener Schäden, bevor sie zu echten technischen Ausfällen führen oder die Verkehrssicherheit beeinträchtigen. Wir empfehlen Ihnen, die Inspektion mit Ölwechsel in den vom Hersteller empfohlenen Intervallen vorzunehmen.</p>
<h2>Gut geschmiert fährt länger – Ölwechsel vom Profi</h2>
<p>Kolben, Zylinder und die Lager der Kurbelwelle erzeugen bei Betrieb stetig mechanische Reibung. Hierdurch entsteht Abrieb, feiner Metallstaub, welcher vom Motoröl aufgenommen werden muss. Dies ist nur bis zu einem gewissen Maße möglich, danach beginnen die Schmiereigenschaften zu leiden.</p>
<p>Altes, verbrauchtes Öl ist keineswegs immer dunkel gefärbt! Bei Dieselmotoren ist die dunkle Farbe sogar ein Indiz für gute Schmiereigenschaften. Unsere Fachkräfte beraten Sie gern und informieren Sie, wann ein Ölwechsel bei Ihrem Fahrzeug nötig ist.</p>
<p>In unserer Werkstatt führen wir sowohl große als auch kleine Inspektionen mit Ölwechsel für Sie durch. Unsere Motoröle erfüllen höchste Ansprüche in Bezug auf Schmierwirkung, Ölschlammverhütung, Säureneutralisation und Verträglichkeit mit Dichtungswerkstoffen.</p>`,
  },
  {
    slug: "haupt-abgasuntersuchung",
    icon: "badge-check",
    title: "HU & AU",
    teaser: "Der TÜV kommt dreimal pro Woche direkt zu uns.",
    headline: "Haupt- und Abgasuntersuchung durch den TÜV",
    body: `
<p>Und zack, sind zwei Jahre auch schon wieder vorbei und die Hauptuntersuchung steht vor der Tür. Kein Problem! Bei uns bekommen Sie das komplette Programm unter einem Dach.</p>
<p>Mehrmals in der Woche ist der TÜV bei uns in der Werkstatt – <strong>montags, mittwochs und freitags</strong> – und führt die Hauptuntersuchung durch. Die dazugehörige Abgasuntersuchung erledigen wir direkt mit.</p>
<p>Melden Sie sich gerne bei uns, um einen Termin zu vereinbaren.</p>`,
  },
  {
    slug: "reifenservice",
    icon: "disc-3",
    title: "Reifenservice",
    teaser: "Wechsel, Auswuchten und fachgerechte Einlagerung.",
    headline: "Professioneller Reifenservice für Ihre Sicherheit",
    body: `
<p>Bei einem Reifenwechsel in unserer Werkstatt überprüfen wir den Reifendruck, die Profiltiefe und eventuelle Schäden an den Seitenwänden – denn nur so können wir Ihnen Sicherheit und Fahrkomfort garantieren.</p>
<h2>Auswuchten bei jedem Wechsel</h2>
<p>Für optimalen Geradeauslauf und einen gleichmäßigen Reifenabrieb ist neben der Achsvermessung auch ein Auswuchten der Räder bei jedem Reifenwechsel erforderlich. Eine Unwucht kann zu vermindertem Kontakt zur Straße führen und bei höheren Geschwindigkeiten falsche Lenkbewegungen zur Folge haben. Zeigen unsere Messgeräte eine Unwucht an, beheben wir diese mithilfe von Auswuchtgewichten an der Felge – der Reifen läuft wieder rund.</p>
<h2>Reifeneinlagerung</h2>
<p>Die Lagerung nicht verwendeter Sommer- oder Winterreifen nimmt viel Platz in Anspruch, und falsche Aufbewahrung kann zu deutlichem Qualitätsverlust führen. Deshalb bieten wir Ihnen die fachgerechte Einlagerung Ihrer Reifen in unseren Räumen an.</p>`,
  },
  {
    slug: "fahrzeugdiagnose",
    icon: "scan-search",
    title: "Fahrzeugdiagnose",
    teaser: "Fehlerspeicher auslesen, Ursache finden, gezielt reparieren.",
    headline: "Fachgerechte Instandsetzung durch zielgenaue Fehlerdiagnose",
    body: `
<p>Eine Vielzahl von Defekten wird von der Bordelektronik automatisch erkannt und im Cockpit angezeigt. Für die Ursachenfindung sind neben dem Verständnis für die komplexe Fahrzeugelektronik auch der fachgerechte Umgang mit modernsten Diagnosegeräten sowie die Interpretation der ausgelesenen Daten notwendig.</p>
<p>Über eigene Schnittstellen lesen wir zunächst die Ereignisspeichereinträge der Steuerelektronik aus und analysieren sie. Anhand dieser Fehleranalyse erstellen wir Ihnen einen realistischen Kostenvoranschlag und erklären Ihnen auf Wunsch die notwendigen Arbeitsschritte. Anschließend erfolgen Fehlerbeseitigung und Instandsetzung.</p>
<p>Die fahrzeuginterne On-Board-Diagnose meldet nicht immer alle Fehlfunktionen. Um gravierende Schäden durch unerkannte Defekte zu vermeiden, empfehlen wir das regelmäßige Auslesen Ihrer Fahrzeugdaten in unserer Werkstatt.</p>`,
  },
  {
    slug: "achsvermessung",
    icon: "crosshair",
    title: "Achsvermessung",
    teaser: "Perfekter Geradeauslauf, weniger Verbrauch und Reifenverschleiß.",
    headline: "Perfekter Geradeauslauf mittels moderner Achsvermessung",
    body: `
<p>Eine ungenaue Einstellung Ihres Fahrwerks führt zu erhöhtem Kraftstoffverbrauch, da der Rollwiderstand durch die Falschstellung der Räder steigt. Bemerkbar macht sich das durch einen Links- oder Rechtsdrall Ihres Fahrzeugs oder eine ungleichmäßige Abnutzung der Reifenprofile.</p>
<p>Mittels moderner Technik vermessen wir die Achsgeometrie Ihres Fahrzeugs und vergleichen die Daten mit den Vorgaben des Herstellers. Stellen wir Abweichungen fest, korrigieren wir diese und führen die Feinjustierung des Fahrwerks durch.</p>
<p>Die korrekte Fahrwerkseinstellung senkt Ihre Kosten für Kraftstoff und Bereifung, erhöht den Fahrkomfort und sorgt für mehr Sicherheit in Kurvenlagen.</p>`,
  },
  {
    slug: "klimaservice",
    icon: "thermometer-snowflake",
    title: "Klimaservice",
    teaser: "Volle Kühlleistung und hygienisch saubere Luft.",
    headline: "Langfristig gutes Klima in Ihrem Fahrzeug",
    body: `
<p>Ein gutes Raumklima sorgt für Wohlbefinden und Gesundheit – auch im Fahrzeug. Damit die Klimaanlage tadellos funktioniert, ist eine regelmäßige Wartung notwendig. Über die Jahre schwindet Kältemittel aus dem Klimakreislauf, was zu deutlichem Leistungsabfall führt. Bei mangelnder Pflege können sich zudem Bakterien und Pilze am Verdampfer ansammeln – mit üblen Gerüchen und möglichen gesundheitlichen Folgen.</p>
<p>Wir empfehlen daher einmal jährlich die umfassende Inspektion Ihrer Klimaanlage. Unsere fachkundigen Mitarbeiter ermitteln Defekte wie Undichtigkeiten oder einen zu geringen Kältemittelstand und beheben diese umgehend.</p>`,
  },
  {
    slug: "spuelung-automatikgetriebe",
    icon: "cog",
    title: "Getriebespülung",
    teaser: "Automatik, DSG, CVT & Multitronic – für sanfte Gangwechsel.",
    headline: "Getriebespülung für Automatik-, DSG- und CVT-Getriebe",
    body: `
<p>Besonders in der kalten Jahreszeit klagen Autofahrer über ruckeligen oder verzögerten Gangwechsel, Leistungsverlust oder Anfahrschwäche. Ein möglicher Grund ist alterndes Getriebeöl, das mit der Zeit an Schmierfähigkeit verliert und für Ablagerungen sorgt, die im schlimmsten Fall die Steuerungskolben verklemmen und das Getriebe beschädigen. Um dem vorzubeugen, empfehlen wir eine Getriebespülung.</p>
<h2>Wann ist eine Getriebespülung notwendig?</h2>
<p>Auch die besten Automatik- und Direktschaltgetriebe unterliegen ständigem Verschleiß. Noch immer gilt der Irrglaube, dass das Getriebeöl nicht gewechselt werden muss – dabei gilt das Versprechen der „lebenslangen Haltbarkeit“ nur für das Autoleben. Wir empfehlen eine Spülung nach rund <strong>60.000 bis 90.000 km</strong>.</p>
<h3>Typische Symptome eines verschmutzten Getriebes</h3>
<ul class="checklist">
  <li>Verzögerter, ruckartiger Gangwechsel</li>
  <li>Anfahrschwäche</li>
  <li>Leistungsverlust, schlechte Beschleunigung</li>
  <li>Erhöhter Kraftstoffverbrauch</li>
  <li>Leichte Geräusche aus dem Motorraum</li>
  <li>Schwarzes Hydrauliköl</li>
</ul>
<h2>Warum Spülung statt Ölwechsel?</h2>
<p>Bei den meisten Getrieben lässt sich technisch bedingt nicht das komplette Öl ablassen – teils nur die Hälfte, bei DSG sogar nur 20–30 %. Der Großteil des alten Öls samt Ablagerungen bleibt also im Getriebe. Bei einer Spülung werden dagegen nahezu 99 % des Getriebes gereinigt.</p>
<ul class="checklist">
  <li>Aktive, mehrfache Reinigung des Getriebes</li>
  <li>Spezialreiniger löst hartnäckige Ablagerungen durch Abrieb</li>
  <li>Nahezu vollständiger Ölwechsel</li>
  <li>Reinigung von Magneten und Ölwanne</li>
  <li>Bessere Schaltqualität und längere Lebensdauer</li>
  <li>Reduzierter Kraftstoffverbrauch</li>
</ul>
<h2>Wie läuft die Spülung ab?</h2>
<p>Vor der Spülung machen wir eine Probefahrt, um erste Unstimmigkeiten zu erkennen. Dann erweitern wir den Ölkreislauf des Getriebes um unser Spülgerät und fügen dem alten Öl bei Betriebstemperatur einen Spezialreiniger bei. Alle Schaltstufen werden mehrfach durchgespült. Anschließend wird das Öl abgepumpt, Ölwanne, Filter und Magnete werden gereinigt und das Getriebe mit neuem Öl befüllt. Meist ist bei der abschließenden Probefahrt sofort ein besseres Schaltverhalten spürbar.</p>
<h2>Dauer, Kosten & geeignete Getriebe</h2>
<p>Der gesamte Vorgang dauert durchschnittlich etwa <strong>2 Stunden</strong>. Die Kosten hängen stark von Fahrzeug und Getriebetyp ab – im Vergleich zu einer Getriebereparatur sind sie nur ein Bruchteil. Bis zu 80 % aller Automatikgetriebe (Automatik, DSG, CVT, Multitronic) können gespült werden. Nennen Sie uns bei Ihrer Anfrage einfach Ihre Fahrzeugdaten, dann erhalten Sie ein passendes Angebot.</p>`,
  },
  {
    slug: "karosseriearbeiten",
    icon: "hammer",
    title: "Karosseriearbeiten",
    teaser: "Vom kleinen Blechschaden bis zur Instandsetzung.",
    headline: "Professionelle Karosserieinstandsetzung",
    body: `
<p>Geringe Schäden nach einem leichten Unfall beseitigt unser geübtes Team unkompliziert und schnell. Ersatz und Neulackierung des Karosserieteils sind dabei meist nicht notwendig.</p>
<p>Auf Basis einer umfassenden Schadenanalyse vereinbaren wir gemeinsam, welche Arbeiten notwendig sind und tatsächlich durchgeführt werden sollen. Natürlich besprechen wir auch die voraussichtlichen Kosten sowie mögliche Alternativen.</p>
<p>Bei starken Beschädigungen sind meist ein Austausch der betroffenen Teile, das Richten der Karosserie und eine anschließende Lackierung notwendig. Dabei achten wir auf eine bestmögliche Annäherung an den Originallack und verwenden nur Originalteile der Markenhersteller.</p>`,
  },
  {
    slug: "unfallservice",
    icon: "siren",
    title: "Unfallservice",
    teaser: "Abschleppen, Kostenvoranschlag, schnelle Instandsetzung.",
    headline: "Service vom Fachmann bei Unfallschäden",
    body: `
<p>Bei einem Unfall oder einer Panne stehen wir Ihnen umgehend zur Seite: Wir schleppen Ihr Fahrzeug direkt vom Unfallort in unsere Werkstatt. Dort führen unsere erfahrenen Mitarbeiter zunächst eine umfassende Fehleranalyse durch und erstellen Ihnen einen Kostenvoranschlag. Die Entscheidung über die Instandsetzung liegt selbstverständlich bei Ihnen.</p>
<p>Damit Sie Ihr Fahrzeug schnell wieder zur Verfügung haben, beginnen wir umgehend mit der Instandsetzung.</p>`,
  },
  {
    slug: "autoglas-steinschlagreparatur",
    icon: "car-front",
    title: "Autoglas & Steinschlag",
    teaser: "Reparatur oder Austausch – inkl. Abwicklung mit der Versicherung.",
    headline: "Steinschlag oder Riss in der Scheibe? Wir helfen schnell.",
    body: `
<p>Steinschlag oder Risse in der Windschutzscheibe sind ein Sicherheitsrisiko. In vielen Fällen ist ein Austausch aber gar nicht erforderlich: Kleine Schäden reparieren wir mit modernsten Verfahren – in den meisten Fällen übernimmt die Kaskoversicherung die Kosten.</p>
<p>Ist ein Austausch unumgänglich, erhalten Sie bei uns für nahezu alle Fahrzeuge eine neue Scheibe in Erstausrüsterqualität inklusive fachmännischer Montage.</p>
<p>Die Abwicklung mit Ihrer Versicherung erledigen wir selbstverständlich auch.</p>`,
  },
  {
    slug: "anhaengerreparatur",
    icon: "truck",
    title: "Anhängerreparatur",
    teaser: "Wartung, Reparatur, Umbau und HU-Vorbereitung.",
    headline: "Anhänger-Service, auf den Sie sich verlassen können",
    body: `
<p>Auf Ihren Anhänger müssen Sie sich hundertprozentig verlassen können. Wir bieten Ihnen das Service-Komplettpaket: Bei der regelmäßigen Wartung prüfen wir unter anderem Bremsen, Räder, Achsen, Elektrik und Rahmen und führen notwendige Arbeiten durch.</p>
<p>Verschleißerscheinungen beheben wir fachmännisch und unkompliziert. Auch bei Unfallinstandsetzungen können Sie auf uns zählen – jeder Arbeitsschritt wird nachvollziehbar für Sie und Ihre Versicherung dokumentiert.</p>
<p>Gern bauen wir Ihren Anhänger nach Ihren Bedürfnissen aus oder um – ausschließlich mit Bauteilen anerkannter Markenhersteller. Und vor der zweijährlichen Hauptuntersuchung prüfen wir Ihren Anhänger auf Mängel, damit Sie sich unnötige Wege und Kosten sparen.</p>`,
  },
];

export const about = {
  title: "Die Autoliebhaber vom Dienst",
  paragraphs: [
    "Wir sind ein freier Kfz-Meisterbetrieb in Büdelsdorf, der im September 2022 von Benjamin Erbst übernommen wurde. Durch regelmäßige Weiterbildungen und Schulungen können wir optimale Serviceleistungen für Fahrzeuge aller Fabrikate anbieten.",
    "Als eine der wenigen Werkstätten können wir auch Reparaturen und Service für Transporter und Wohnmobile anbieten. Mit vier Hebebühnen sorgen wir für schnellen und unkomplizierten Service. Besonders wichtig sind uns herstellerneutrale, persönliche Beratung und faire Preise – und damit Sie mobil bleiben, bieten wir Ihnen auch Leihwagen für die Zeit der Reparatur an.",
  ],
  quote: "Fair, ehrlich und kompetent – für diese Werte stehen wir in unserer Autowerkstatt.",
};

export const gallery = [
  { src: "galerie-3.jpg", alt: "Außenansicht von Benny´s Autoservice mit Kundenfahrzeugen" },
  { src: "galerie-2.jpg", alt: "Blick in die Werkstatt mit Fahrzeug auf der Hebebühne" },
  { src: "galerie-1.jpg", alt: "Kundenempfang und Wartebereich" },
];

export const job = {
  title: "Kfz-Mechatroniker/in (w/m/d)",
  intro: "Zur Verstärkung unseres Teams suchen wir ab sofort eine/n Kfz-Mechatroniker/in in Vollzeit oder auf Stundenbasis.",
  pitch: "Du hast eine abgeschlossene Berufsausbildung, möglichst Berufserfahrung, Schrauber-Leidenschaft und Benzin im Blut? Dann bist du in unserem Team genau richtig.",
  bring: ["Pünktlichkeit", "Ehrlichkeit", "Zuverlässigkeit", "Arbeitsbereitschaft", "Lust und Spaß bei der Arbeit"],
  offer: [
    "Pünktliche, leistungsgerechte Bezahlung",
    "Ein familiäres und harmonisches Miteinander",
    "Regelmäßige Schulungen und Weiterbildungen",
    "Abwechslungsreicher Aufgabenbereich",
    "Verantwortung im Unternehmen",
  ],
};
