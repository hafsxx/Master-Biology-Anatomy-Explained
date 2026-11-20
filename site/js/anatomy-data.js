export const anatomyDatabase = {
    bs: {
        circulatory: {
            title: "1. Cirkulatorni (Krvotok) Sistem",
            desc: "Transportuje kisik, nutrijente, hormone i otpadne materije kroz organizam.",
            organs: [
                "Srce: **četiri komore** (dva atrija, dva ventrikula) sa **fibroznim skeletom** i zaliscima (trikuspidalni, **mitralni**, aortni i plućni semilunarni) koji osiguravaju jednosmjerni tok.",
                "Arterije: elastične i mišićne cijevi pod visokim pritiskom; **aorta** prima udarni volumen. Izuzetak: **plućna arterija** nosi deoksigeniranu krv.",
                "Vene: veći lumen, niži pritisak, **jednosmjerni zalisci**; venski povratak zavisi od skeletne 'pumpe' i negativnog torakalnog pritiska.",
                "Kapilari: jednoslojni **endotel** — mjesto **Starlingove razmjene** tečnosti, O2/CO2 i metabolita."
            ],
            functions: [
                "Dostava O2 vezanog za **hemoglobin**; **Frank–Starlingov zakon**: veći end-dijastolički volumen → jača kontrakcija.",
                "Transport glukoze, aminokiselina i hilomikrona; jetra prima portalnu krv.",
                "Uklanjanje **CO2**, uree i kreatinina prema plućima i bubrezima.",
                "Termoregulacija: **vazodilatacija** / **vazokonstrikcija**; baroreceptori u karotisnom sinusu čuvaju MAP."
            ],
            cellType: "Eritrocit (crveno krvno zrno)",
            cellParts: [
                "Zreli sisarski eritrocit je **bez jezgra** — maksimalan prostor za Hb.",
                "**Bikonkavni disk** povećava odnos površine i zapremine i omogućava deformaciju u kapilarima.",
                "Svaka molekula **hemoglobina** ima 4 hema sa **Fe2+** koji reverzibilno veže O2; Bohr-efekt olakšava otpuštanje u tkivima."
            ],
            illnesses: [
                "**Ateroskleroza**: lipidni plak u intimi → stenоза i rizik tromboze.",
                "**Infarkt miokarda**: okluzija koronarne arterije → ishemijska nekroza.",
                "**Hipertenzija** (**>140/90 mmHg**): remodeliranje sudova, bubrega i mozga."
            ]
        },
        respiratory: {
            title: "2. Respiratorni (Disajni) Sistem",
            desc: "Omogućava razmjenu plinova (O2 i CO2) između organizma i spoljašnje sredine.",
            organs: [
                "Nosna šupljina i Ždrijelo (Pharynx): Filtriraju, zagrijavaju i vlaže udahnuti zrak pomoću sluznice i dlačica.",
                "Grkljan (Larynx): Sadrži glasne žice i hrskavični poklopac (epiglottis) koji zatvara ulaz u dušnik tokom gutanja.",
                "Dušnik (Trachea): Cijev podržana hrskavičnim prstenovima u obliku slova C, obložena trepetljastim epitelom koji izbacuje nečistoće.",
                "Bronhije i Pluća: Grananje disajnih puteva na sve manje bronhiole koje završavaju u grozdastim grozdovima alveola."
            ],
            functions: [
                "Spoljašnje disanje: Unos O2 iz zraka u krvotok i izbacivanje CO2 u spoljašnju sredinu.",
                "Regulacija acidobazne ravnoteže krvi održavanjem koncentracije ugljene kiseline i pH vrijednosti (7.35-7.45).",
                "Fonacija (stvaranje glasa) prolaskom zračne struje preko glasnih žica."
            ],
            cellType: "Pneumociti Tip I i Tip II",
            cellParts: [
                "Pneumociti Tip I: Izuzetno tanke, spljoštene ćelije koje pokrivaju 95% površine alveola i čine dio tanke respiratorne membrane kroz koju gasovi difunduju.",
                "Pneumociti Tip II: Krupnije kubične ćelije koje sintetiziraju i luče surfaktant – smjesu fosfolipida i proteina koja smanjuje površinsku napetost i sprečava kolaps alveola pri izdisaju."
            ],
            illnesses: [
                "Bronhijalna astma: Hronično upalno oboljenje disajnih puteva koje uzrokuje spazam glatkih mišića bronha, oticanje sluznice i otežano disanje.",
                "Pneumonija (Upala pluća): Infekcija alveola uzrokovana bakterijama ili virusima, pri čemu se alveolarni prostori pune gnojem i tečnošću.",
                "KOPB (Hronična opstruktivna bolest pluća): Progresivno oštećenje plućnog tkiva i smanjenje protoka zraka, najčešće uzrokovano dugotrajnim pušenjem."
            ]
        },
        digestive: {
            title: "3. Probavni Sistem",
            desc: "Svršava mehaničku i hemijsku obradu hrane, apsorbuje nutrijente i izbacuje otpad.",
            organs: [
                "Usta i Jednjak: Mehanička obrada hranom pomoću zuba i usitnjavanje, te transport peristaltičkim pokretima.",
                "Želudac: Mišićni organ koji miješa hranu sa želudačnim sokom koji sadrži hlorovodoničnu kiselinu (HCl) i enzim pepsin.",
                "Tanko crijevo (Duodenum, Jejunum, Ileum): Glavno mjesto hemijske razgradnje hrane i apsorpcije nutrijenata putem crijevnih resica.",
                "Debelo crijevo: Apsorpcija vode, elektrolita i formiranje izmeta uz pomoć crijevne mikrobiote.",
                "Jetra i Gušterača: Jetra proizvodi žuč za emulgaciju masti, dok gušterača luči ključne probavne enzime (amilaza, lipaza, tripsin)."
            ],
            functions: [
                "Ingestija, mehanička fragmentacija i peristaltičko potiskivanje hrane.",
                "Enzimatska hidroliza složenih ugljenih hidrata, proteina i masti do prosto razgradivih molekula.",
                "Apsorpcija monosaharida, aminokiselina, masnih kiselina, minerala i vode u krv i limfu."
            ],
            cellType: "Enterocit (Epitelska ćelija sa četkastim porubom)",
            cellParts: [
                "Gusta mreža mikrovila na apikalnoj površini koja enormno povećava apsorpcionu površinu tankog crijeva.",
                "Brojne mitohondrije u citoplazmi koje obezbjeđuju ATP za aktivni transport jona i nutrijenata protiv koncentracijskog gradijenta.",
                "Čvrsti spojevi (tight junctions) između susjednih ćelija koji sprečavaju nekontrolisani prolaz materija između ćelija."
            ],
            illnesses: [
                "Peptički ulkus (Čir): Oštećenje sluznice želuca ili duodenuma uzrokovano djelovanjem kiseline, često povezano sa bakterijom Helicobacter pylori.",
                "Ciroza jetre: Zamjena zdravog jetrenog tkiva ožiljnim fibroznim tkivom usljed hroničnog oštećenja (alkohol, hepatitis), što vodi do otkazivanja jetre.",
                "Celijakija: Autoimuni poremećaj u kojem unos glutena uzrokuje imunološki napad i uništenje crijevnih resica u tankom crijevu."
            ]
        },
        nervous: {
            title: "4. Nervni Sistem",
            desc: "Prikuplja, obrađuje i šalje informacije brzim električnim i hemijskim signalima.",
            organs: [
                "Veliki mozak (Cerebrum): Odgovoran za svijest, razmišljanje, pamćenje, voljne pokrete i obradu osjetnih informacija.",
                "Mali mozak (Cerebellum): Koordinira ravnotežu, preciznost pokreta i motoričko učenje.",
                "Moždano stablo: Kontroliše vitalne nevoljne funkcije poput disanja, rada srca i krvnog pritiska.",
                "Kičmena moždina i Periferni živci: Sprovode impulse između mozga i ostatka tijela te posreduju u refleksnim reakcijama."
            ],
            functions: [
                "Senzorna integracija: Prijem podražaja iz unutrašnjeg i spoljašnjeg okruženja.",
                "Motorna kontrola: Slanje komandi mišićima i žlijezdama za adekvatan odgovor.",
                "Kognicija, emocije, učenje i održavanje stanja budnosti i spavanja."
            ],
            cellType: "Neuron (Nervna ćelija)",
            cellParts: [
                "Tijelo ćelije (Soma): Sadrži jezgro i sintetiše neurotransmitere.",
                "Dendriti: Razgranati nastavci koji primaju signale od drugih neurona.",
                "Akson: Dugački nastavak koji prenosi akcioni potencijal prema drugim ćelijama, obavijen izolacijskim mijelinskim omotačem koji ubrzava prenos signala."
            ],
            illnesses: [
                "Multipla skleroza: Autoimuna bolest u kojoj imuni sistem napada i uništava mijelinski omotač aksona u centralnom nervnom sistemu.",
                "Alzheimerova bolest: Progresivno neurodegenerativno oboljenje karakterisano taloženjem beta-amiloidnih plakova i gubitkom pamćenja i kognitivnih funkcija.",
                "Epilepsija: Poremećaj koji karakterišu ponavljani napadi uzrokovani abnormalnim, prekomjernim električnim pražnjenjem grupa grupa neurona u mozgu."
            ]
        },
        skeletal: {
            title: "5. Skeletni (Koštani) Sistem",
            desc: "Pruža strukturalni oslonac, štiti unutrašnje organe i služi kao depo minerala.",
            organs: [
                "Kostur (206 kostiju): Podijeljen na aksijalni (lobanja, kičma, grudni koš) i apendikularni skelet (ekstremiteti i pojasevi).",
                "Zglobovi: Spojevi između kostiju koji mogu biti nepokretni (šavovi lobanje) ili pokretni (sinovijalni zglobovi poput koljena).",
                "Hrskavica i Ligamenti: Hrskavica smanjuje trenje u zglobovima, dok ligamenti spajaju kost sa košću pružajući stabilnost."
            ],
            functions: [
                "Mehanička potpora tijelu i zaštita osjetljivih unutrašnjih organa (mozak, srce, pluća).",
                "Hematopojeza: Proizvodnja svih vrsta krvnih ćelija u crvenoj koštanoj srži.",
                "Homeostaza minerala: Deponovaje i otpuštanje kalcijuma i fosfata prema potrebama organizma."
            ],
            cellType: "Osteocit (Zrela koštana ćelija)",
            cellParts: [
                "Smješten unutar malih šupljina (lakuna) u mineralizovanom matriksu.",
                "Posjeduje duge citoplazmatske nastavke koji prolaze kroz uske kanaliće (canaliculi) omogućavajući razmjenu hranljivih materija i komunikaciju među ćelijama.",
                "Senzor mehaničkog opterećenja koji reguliše rad osteoblasta (izgradnja kosti) i osteoklasta (razgradnja kosti)."
            ],
            illnesses: [
                "Osteoporoza: Smanjenje gustoće i kvaliteta kosti usljed prekomjerne razgradnje u odnosu na izgradnju, što dovodi do povećane krhkosti i lomljivosti.",
                "Reumatoidni artritis: Hronična autoimuna upala sinovijalne membrane zglobova koja uzrokuje oštećenje hrskavice, deformaciju i bol.",
                "Rahitiz: Poremećaj mineralizacije kostiju u razvoju kod djece usljed nedostatka vitamina D ili kalcijuma."
            ]
        },
        muscular: {
            title: "6. Mišićni Sistem",
            desc: "Omogućava aktivno kretanje tijela, pokretanje unutrašnjih organa i održavanje držanja.",
            organs: [
                "Skeletni mišići: Prugasti mišići pod voljnom kontrolom koji su tetivama pričvršćeni za kosti.",
                "Glatki mišići: Nevoljni mišići smješteni u zidovima šupljih organa (želudac, crijeva, krvni sudovi).",
                "Srčani mišić (Miokard): Poprečno-prugasti nevoljni mišić specifične građe sa sposobnošću automatskog ritmičkog grčenja."
            ],
            functions: [
                "Proizvodnja kretanja tijela i stabilizacija zglobova pri održavanju uspravnog položaja.",
                "Pokretanje sadržaja kroz šuplje organe (peristaltika, protok krvi).",
                "Termogeneza: Generisanje toplote tokom mišićne kontrakcije radi održavanja tjelesne temperature."
            ],
            cellType: "Miocit / Mišićno vlakno",
            cellParts: [
                "Miofibrili: Paralelno postavljena vlakna sastavljena od kontraktilnih proteina aktina i miozina organizovanih u sarkomere.",
                "Sarkoplazmatični retikulum: Specijalizovana mreža koja skladišti i masovno otpušta jone kalcijuma (Ca2+) za pokretanje kontrakcije.",
                "Brojne mitohondrije za stalno snabdijevanje ATP-om neophodnim za rad mišića."
            ],
            illnesses: [
                "Duchenneova mišićna distrofija: Genetski poremećaj uzrokovan nedostatkom proteina distrofina, što dovodi do progresivne degeneracije i slabosti mišića.",
                "Myasthenia gravis: Autoimuna bolest u kojoj antitijela blokiraju ili uništavaju acetilholinske receptore na neuromuscularnoj spojnici.",
                "Mišićna atrofija: Smanjenje mase i snage mišića usljed neaktivnosti, dugotrajnog mirovanja ili oštećenja nerava."
            ]
        },
        integumentary: {
            title: "7. Kožni Sistem",
            desc: "Predstavlja spoljašnji zaštitni omotač tijela i primarni osjetni organ.",
            organs: [
                "Epidermis: Spoljašnji višeslojni rožnati epitel bez krvnih sudova.",
                "Dermis: Unutrašnji vezivni sloj bogat krvnim sudovima, nervnim završecima, kolagenom i elastinom.",
                "Hipodermis (Potkožno tkivo): Sloj masnog i rastresitog vezivnog tkiva koji služi kao toplotni izolator i energetski depo.",
                "Adneksi kože: Znojne žlijezde, lojne žlijezde, dlake i nokti."
            ],
            functions: [
                "Fizička, hemijska i biološka zaštita od mehanikih povreda, patogena i UV zračenja.",
                "Termoregulacija lučenjem znoja i promjenom protoka krvi kroz dermis.",
                "Sinteza vitamina D3 pod uticajem ultraljubičastog zračenja."
            ],
            cellType: "Keratinocit i Melanocit",
            cellParts: [
                "Keratinocit: Proizvodi otporni protein keratin koji daje čvrstinu i nepropusnost za vodu.",
                "Melanocit: Sintetiše pigment melanin i predaje ga keratinocitima u obliku kapsula (melanosoma) koje štite DNK u jezgru od UV oštećenja."
            ],
            illnesses: [
                "Melanom: Izuzetno maligni tumor koji nastaje nekontrolisanim bujanjem izmijenjenih melanocita.",
                "Psorijaza: Hronična autoimuna bolest karakterisana ubrzanom proliferacijom keratinocita i stvaranjem crvenih ljuskavih žarišta na koži.",
                "Atopijski dermatitis (Ekcem): Hronična upalna reakcija kože uzrokovana poremećajem barijerne funkcije i preosjetljivošću imunog sistema."
            ]
        },
        immune: {
            title: "8. Imuni i Limfni Sistem",
            desc: "Prepoznaje i uništava patogene, strane materije i izmijenjene vlastite ćelije.",
            organs: [
                "Primarni limfni organi: Koštana srž (sazrijevanje B limfocita) i Timus (sazrijevanje T limfocita).",
                "Sekundarni limfni organi: Slezena (filtrira krv), limfni čvorovi (filtriraju limfu) i krajnici.",
                "Limfni sudovi: Mreža kanala koja prikuplja višak međućelijske tečnosti (limfu) i vraća je u venski krvotok."
            ],
            functions: [
                "Odbrana organizma putem urođenog (nespecifičnog) i stečenog (specifičnog) imuniteta.",
                "Prepoznavanje i uklanjanje oštećenih, starih ili kancerogenih ćelija vlastitog tijela.",
                "Održavanje volumena tečnosti u tkivima i apsorpcija masti iz probavnog trakta."
            ],
            cellType: "Leukociti (B i T Limfociti, Makrofagi)",
            cellParts: [
                "B limfociti: Diferenciraju se u plazma ćelije koje masovno luče specifična antitijela (imunoglobuline).",
                "T limfociti: Citotoksični T ćelije direktno uništavaju zaražene ćelije, dok pomagačke T ćelije koordiniraju imuni odgovor.",
                "Makrofagi: Sposobnost fagocitoze (gutanja) patogena i prezentacije antigena."
            ],
            illnesses: [
                "HIV / AIDS: Virus humane imunodeficijencije napada i uništava CD4+ T pomagačke limfocite, što vodi do teške slabosti imunog sistema.",
                "Sistemski eritemski lupus: Autoimuno oboljenje u kojem tijelo stvara antitijela protiv vlastitih struktura u jezgru ćelija, oštećujući više organa.",
                "Limfom: Maligno oboljenje limfnog tkiva koje počinje nekontrolisanim bujanjem limfocita u limfnim čvorovima."
            ]
        },
        endocrine: {
            title: "9. Endokrini Sistem",
            desc: "Reguliše dugotrajne fiziološke procese lučenjem hemijskih glasnika (hormona) direktno u krv.",
            organs: [
                "Hipofiza: 'Glavna žlijezda' koja pod kontrolom hipotalamusa upravlja radom drugih endokrinih žlijezda.",
                "Štitna žlijezda (Thyroidea): Luči hormone T3 i T4 koji kontrolišu bazalni metabolizam.",
                "Nadbubrežne žlijezda: Kora luči kortizol i aldosteron, dok srž luči adrenaline i noradrenalin (stresni odgovor).",
                "Pankreas (Gušterača): Endokrini dio (Langerhansova ostrvca) luči insulin i glukagon."
            ],
            functions: [
                "Održavanje homeostaze (nivo glukoze, elektrolita, vode, krvnog pritiska).",
                "Regulacija rasta, razvitka, metabolizma i reproduktivnih ciklusa.",
                "Adaptacija organizma na fizički i psihički stres."
            ],
            cellType: "Beta-ćelija gušterače",
            cellParts: [
                "Veoma razvijen hrapavi endoplazmatični retikulum i Golgi aparat za sintezu i pakovanje preinzulina.",
                "Sekretorne granule bogate cinkom u kojima se skladišti zreli insulin spreman za egzitozu pri povišenom nivou glukoze u krvi.",
                "Glukozo-senzorski kanali (GLUT2 i ATP-zavisni K+ kanali) koji spajaju nivo glukoze sa sekrecijom."
            ],
            illnesses: [
                "Diabetes Mellitus (Šećerna bolest): Tip 1 (autoimuno uništenje beta-ćelija) ili Tip 2 (periferna rezistencija na insulin), što uzrokuje hroničnu hiperglikemiju.",
                "Hipotireoza: Nedovoljna proizvodnja hormona štitne žlijezde, što dovodi do usporavanja metabolizma, umora i gojaznosti.",
                "Cushingov sindrom: Poremećaj uzrokovan dugotrajno povišenim nivoom kortizola u krvi."
            ]
        },
        urinary: {
            title: "10. Urinarni (Mokraćni) Sistem",
            desc: "Filtrira krv, uklanja štetne metaboličke produkte i održava ravnotežu vode i elektrolita.",
            organs: [
                "Bubrezi: Parni organi sastavljeni od oko milion funkcionalnih jedinica – nefrona.",
                "Mokraćovodi (Ureteri): Cijevi koje peristaltičkim pokretima sprovode urin od bubrega do mjehura.",
                "Mokraćni mjehur: Elastični mišićni rezervoar za privremeno skladištenje urina.",
                "Mokraćna cijev (Uretra): Kanal kroz koji se urin izbacuje iz tijela."
            ],
            functions: [
                "Filtracija krvi i izlučivanje uree, mokraćne kiseline i kreatinina.",
                "Regulacija zapremine krvi, krvnog pritiska (sistem reninski-angiotenzin-aldosteron) i osmotske ravnoteže.",
                "Regulacija koncentracije jona (Na+, K+, Ca2+) i acidobazne ravnoteže (HCO3- i H+)."
            ],
            cellType: "Podocit (Ćelija visceralnog sloja Bowmanove kapsule)",
            cellParts: [
                "Dugi primarni i sekundarni nožni nastavci (pedikuli) koji obavijaju kapilare glomerula.",
                "Između nastavaka nalaze se filtracione pukotine premoštene proteinskom dijafragmom koje čine ključnu barijeru za proteine krvi."
            ],
            illnesses: [
                "Bubrežni kamenci (Urolitijaza): Formiranje čvrstih mineralnih naslaga (najčešće kalcijum-oksalat) u bubrežnoj karlici ili mokraćovodima.",
                "Hronična bubrežna insuficijencija: Progresivni i ireverzibilni gubitak funkcije nefrona koji na kraju zahtijeva dijalizu ili transplantaciju.",
                "Pijelonefritis: Ozbiljna bakterijska infekcija bubrežnog tkiva koja se obično širi iz donjih dijelova urinarnog trakta."
            ]
        },
        reproductive: {
            title: "11. Reproduktivni Sistem",
            desc: "Proizvodi polne ćelije (gamete), luči polne hormone i omogućava nastavak vrste.",
            organs: [
                "Muški organi: Testisi (proizvodnja sperme i testosterona), Semenovodi, Prostata i Semene kesice (proizvodnja seminalne tečnosti).",
                "Ženski organi: Jajnici (sazrijevanje jajnih ćelija i lučenje estrogena/progesterona), Jajovodi (mjesto oplodnje), Materica (razvoj fetusa) i Vagina."
            ],
            functions: [
                "Gametogeneza: Proizvodnja haploidnih polnih ćelija (spermatogeneza i oogeneza).",
                "Sinteza i lučenje polnih hormona koji kontrolišu sekundarne polne karakteristike i reproduktivne cikluse.",
                "Gestacija i porođaj (kod ženskog pola)."
            ],
            cellType: "Spermatozoid i Oocit",
            cellParts: [
                "Spermatozoid: Izuzetno pokretna ćelija sa akrozomom (sadrži enzime za razgradnju omotača jajne ćelije), srednjim dijelom prepunim mitohondrija i bičem (flagelum) za kretanje.",
                "Oocit: Velika nepokretna ćelija bogata hranljivim materijama u citoplazmi, zaštićena slojem zona pellucida i corona radiata."
            ],
            illnesses: [
                "Sindrom policističnih jajnika (PCOS): Endokrini poremećaj karakterisan izostankom ovulacije, povišenim androgenima i stvaranjem cista na jajniciima.",
                "Endometrioza: Stanje u kojem tkivo slično sluznici materice (endometrijum) raste izvan materice uzrokujući upale i hronični bol.",
                "Benigna hiperplazija prostate: Dobroćudno uvećanje prostate kod starijih muškaraca koje pritiska uretru i otežava mokrenje."
            ]
        }
    },
    en: {
        circulatory: {
            title: "1. Circulatory System",
            desc: "Transports oxygen, nutrients, hormones, and metabolic waste products throughout the body.",
            organs: [
                "Heart: **four chambers** (two atria, two ventricles) with a **fibrous skeleton** and valves (tricuspid, **mitral**, aortic and pulmonary semilunar) enforcing one-way flow.",
                "Arteries: elastic then muscular vessels under high pressure; the **aorta** takes stroke volume. Exception: the **pulmonary artery** carries deoxygenated blood.",
                "Veins: larger lumen, lower pressure, **one-way valves**; venous return uses the skeletal-muscle pump and negative thoracic pressure.",
                "Capillaries: single-layer **endothelium** — site of **Starling fluid exchange**, gases, and metabolites."
            ],
            functions: [
                "Deliver O2 bound to **hemoglobin**; **Frank–Starling law**: greater end-diastolic volume → stronger contraction.",
                "Move glucose, amino acids, and chylomicrons; the liver sees portal blood first.",
                "Clear **CO2**, urea, and creatinine toward lungs and kidneys.",
                "Thermoregulation via **vasodilation** / **vasoconstriction**; carotid baroreceptors defend MAP."
            ],
            cellType: "Erythrocyte (red blood cell)",
            cellParts: [
                "Mature mammalian RBCs are **anucleate** — maximizing space for Hb.",
                "A **biconcave disc** raises surface-area-to-volume ratio and lets cells flex through capillaries.",
                "Each **hemoglobin** tetramer has 4 hemes with **Fe2+** that bind O2 reversibly; the Bohr effect unloads O2 in tissues."
            ],
            illnesses: [
                "**Atherosclerosis**: lipid plaque in the intima → stenosis and thrombosis risk.",
                "**Myocardial infarction**: coronary occlusion → ischemic necrosis.",
                "**Hypertension** (**>140/90 mmHg**): vascular, renal, and cerebral remodeling."
            ]
        },
        respiratory: {
            title: "2. Respiratory System",
            desc: "Facilitates gas exchange between the organism and the external environment.",
            organs: [
                "Nasal Cavity & Pharynx: Warms, humidifies, and filters incoming air using ciliated mucosa and mucus.",
                "Larynx: Contains the vocal cords and the epiglottis, a cartilaginous flap that seals the airway during deglutition.",
                "Trachea: Windpipe reinforced by C-shaped hyaline cartilage rings, lined with pseudostratified ciliated columnar epithelium.",
                "Bronchi & Lungs: Branching airway network terminating in microscopic alveolar clusters where gas exchange occurs."
            ],
            functions: [
                "External respiration: Intake of atmospheric O2 into the bloodstream and exhalation of metabolic CO2.",
                "Systemic pH regulation by altering carbonic acid levels through respiratory rate adjustments.",
                "Phonation via airflow-induced vibration of the vocal folds."
            ],
            cellType: "Type I and Type II Pneumocytes",
            cellParts: [
                "Type I Pneumocytes: Extremely thin, attenuated simple squamous cells covering ~95% of the alveolar surface, forming the thin blood-air barrier.",
                "Type II Pneumocytes: Cuboidal cells that synthesize and secrete pulmonary surfactant—a dipalmitoylphosphatidylcholine-rich complex that lowers surface tension to prevent alveolar collapse."
            ],
            illnesses: [
                "Bronchial Asthma: Chronic inflammatory airway disease characterized by bronchial smooth muscle hyperresponsiveness and mucus hypersecretion.",
                "Pneumonia: Acute infection of the pulmonary parenchyma resulting in alveolar exudate accumulation and impaired gas exchange.",
                "COPD (Chronic Obstructive Pulmonary Disease): Progressive airflow limitation caused by emphysematous tissue destruction and chronic bronchitis."
            ]
        },
        digestive: {
            title: "3. Digestive System",
            desc: "Breaks down food mechanically and chemically, absorbs nutrients, and excretes waste.",
            organs: [
                "Mouth & Esophagus: Mastication and propulsion via peristaltic waves.",
                "Stomach: Muscular organ that churns food with gastric juice containing hydrochloric acid (HCl) and pepsinogen.",
                "Small Intestine (Duodenum, Jejunum, Ileum): Primary site of enzymatic digestion and nutrient absorption.",
                "Large Intestine: Water and electrolyte reabsorption, compaction of feces aided by the gut microbiome.",
                "Liver & Pancreas: Liver synthesizes bile for lipid emulsification; pancreas secretes key digestive enzymes (lipase, amylase, trypsinogen)."
            ],
            functions: [
                "Ingestion, mechanical breakdown, and coordinated propulsion of food along the GI tract.",
                "Enzymatic cleavage of macromolecules into absorbable monomers.",
                "Transepithelial transport of water, ions, and nutrients into the portal circulation and lacteals."
            ],
            cellType: "Enterocyte (Intestinal Absorptive Cell)",
            cellParts: [
                "Dense apical microvilli forming a brush border loaded with membrane-bound digestive enzymes.",
                "Abundant mitochondria to supply ATP for Na+/K+-ATPase pumps driving secondary active transport.",
                "Tight junctional complexes sealing the intercellular space to regulate paracellular permeability."
            ],
            illnesses: [
                "Peptic Ulcer Disease: Mucosal erosion in the stomach or duodenum resulting from acid-pepsin damage, often linked to Helicobacter pylori infection.",
                "Liver Cirrhosis: Diffuse disorganization of normal hepatic architecture by fibrotic scar tissue due to chronic liver injury.",
                "Celiac Disease: Autoimmune enteropathy triggered by dietary gluten ingestion, causing diffuse villous atrophy in the small intestine."
            ]
        },
        nervous: {
            title: "4. Nervous System",
            desc: "Coordinates body functions through rapid transmission of electrical and chemical signals.",
            organs: [
                "Cerebrum: Responsible for conscious perception, executive function, motor planning, and memory.",
                "Cerebellum: Regulates motor coordination, posture, fine motor control, and motor learning.",
                "Brainstem: Controls vital autonomic centers governing respiration, cardiac rhythm, and vascular tone.",
                "Spinal Cord & Peripheral Nerves: High-speed signal conduits mediating sensory input, motor output, and reflex arcs."
            ],
            functions: [
                "Sensory processing: Transduction and integration of internal and external environmental stimuli.",
                "Motor output: Precise control of skeletal muscle contraction and glandular secretion.",
                "Cognition, emotional processing, learning, and consciousness modulation."
            ],
            cellType: "Neuron (Nerve Cell)",
            cellParts: [
                "Soma (Cell Body): Contains the nucleus and Nissl bodies for protein and neurotransmitter synthesis.",
                "Dendrites: Highly branched processes that receive synaptic inputs.",
                "Axon: Single long process that propagates action potentials toward target cells, insulated by a segmented myelin sheath."
            ],
            illnesses: [
                "Multiple Sclerosis: Autoimmune demyelinating disease of the central nervous system impairing axonal conduction.",
                "Alzheimer's Disease: Neurodegenerative dementia characterized by extracellular amyloid-beta plaques and intracellular tau neurofibrillary tangles.",
                "Epilepsy: Neurological disorder characterized by recurrent, unprovoked seizures due to abnormal, hypersynchronous neuronal firing."
            ]
        },
        skeletal: {
            title: "5. Skeletal System",
            desc: "Provides structural framework, organ protection, and mineral storage.",
            organs: [
                "Bones (206 total): Divided into axial (skull, vertebral column, thoracic cage) and appendicular (girdles and limbs) skeletons.",
                "Joints: Structural articulations ranging from immovable sutures to highly mobile synovial joints.",
                "Cartilage & Ligaments: Articular cartilage reduces friction; ligaments connect bone to bone to reinforce joint integrity."
            ],
            functions: [
                "Rigid support framework and mechanical protection for vital soft organs.",
                "Hematopoiesis: Synthesis of blood elements within red bone marrow.",
                "Mineral homeostasis: Reservoir for 99% of systemic calcium and 85% of phosphorus."
            ],
            cellType: "Osteocyte (Mature Bone Cell)",
            cellParts: [
                "Housed within small mineralized cavities called lacunae.",
                "Extends long cytoplasmic processes through micro-canals (canaliculi) to form gap junctions with neighboring osteocytes.",
                "Acts as a mechanosensor regulating osteoblast-mediated bone formation and osteoclast-mediated bone resorption."
            ],
            illnesses: [
                "Osteoporosis: Metabolic bone disease marked by low bone mineral density and microarchitectural deterioration leading to fragility fractures.",
                "Rheumatoid Arthritis: Systemic autoimmune disease featuring chronic inflammation of synovial membranes and articular cartilage destruction.",
                "Rickets: Defective bone mineralization in growing children typically caused by severe Vitamin D deficiency."
            ]
        },
        muscular: {
            title: "6. Muscular System",
            desc: "Enables voluntary locomotion, involuntary organ movement, and posture regulation.",
            organs: [
                "Skeletal Muscle: Striated muscle under voluntary somatic control attached to bones via tendons.",
                "Smooth Muscle: Non-striated involuntary muscle lining the walls of hollow visceral organs and blood vessels.",
                "Cardiac Muscle: Striated, involuntary muscle with intercalated discs containing gap junctions for synchronized contraction."
            ],
            functions: [
                "Generation of mechanical force for locomotion, posture maintenance, and joint stabilization.",
                "Propulsion of substances through visceral conduits (peristalsis, vasoconstriction).",
                "Thermogenesis: Production of heat as a metabolic byproduct of muscle contraction."
            ],
            cellType: "Myocyte / Muscle Fiber",
            cellParts: [
                "Myofibrils: Contractile elements composed of repeating sarcomeric units containing actin (thin) and myosin (thick) filaments.",
                "Sarcoplasmic Reticulum: Specialized smooth ER that stores and rapidly releases Ca2+ ions to trigger cross-bridge cycling.",
                "Densely packed mitochondria to supply continuous ATP needed for cross-bridge detachment."
            ],
            illnesses: [
                "Duchenne Muscular Dystrophy: X-linked recessive disorder caused by dystrophin protein absence, leading to progressive muscle fiber necrosis.",
                "Myasthenia Gravis: Autoimmune channelopathy where autoantibodies target postsynaptic acetylcholine receptors at neuromuscular junctions.",
                "Muscle Atrophy: Loss of muscle mass and cross-sectional area resulting from disuse, denervation, or catabolic states."
            ]
        },
        integumentary: {
            title: "7. Integumentary System",
            desc: "Forms the protective external barrier of the body and serves as a major sensory interface.",
            organs: [
                "Epidermis: Avascular keratinized stratified squamous epithelium.",
                "Dermis: Vascularized dense irregular connective tissue layer containing nerves, hair follicles, and glands.",
                "Hypodermis (Subcutaneous Layer): Adipose-rich tissue providing thermal insulation and mechanical cushioning.",
                "Appendages: Sweat glands, sebaceous glands, hair, and nails."
            ],
            functions: [
                "Protection against mechanical trauma, chemical insult, desiccation, and pathogen invasion.",
                "Thermoregulation via sweat evaporation and cutaneous vasodilation/vasoconstriction.",
                "Photochemical synthesis of Vitamin D3 (cholecalciferol) from 7-dehydrocholesterol."
            ],
            cellType: "Keratinocyte and Melanocyte",
            cellParts: [
                "Keratinocyte: Produces tough keratin intermediate filaments and lamellar bodies that render the skin water-resistant.",
                "Melanocyte: Synthesizes melanin pigment in melanosomes and transfers it to neighboring keratinocytes to shield nuclear DNA from UV damage."
            ],
            illnesses: [
                "Melanoma: Aggressive cutaneous malignancy arising from the transformation of melanocytes.",
                "Psoriasis: Autoimmune skin disease characterized by hyperproliferation of keratinocytes and erythematous plaques with silvery scales.",
                "Atopic Dermatitis (Eczema): Chronic inflammatory skin condition featuring epidermal barrier breakdown and intense pruritus."
            ]
        },
        immune: {
            title: "8. Immune & Lymphatic System",
            desc: "Detects and neutralizes foreign pathogens, toxin molecules, and transformed host cells.",
            organs: [
                "Primary Lymphoid Organs: Bone marrow (site of hematopoiesis and B-cell maturation) and Thymus (T-cell maturation).",
                "Secondary Lymphoid Organs: Spleen (filters blood), lymph nodes (filter interstitial fluid), and mucosa-associated lymphoid tissue (MALT).",
                "Lymphatic Vessels: One-way drainage system that collects interstitial fluid (lymph) and returns it to venous circulation."
            ],
            functions: [
                "Defense against pathogens via innate (non-specific) and adaptive (antigen-specific) immune mechanisms.",
                "Immune surveillance: Identification and destruction of senescent, damaged, or neoplastic host cells.",
                "Fluid balance maintenance and absorption of dietary lipids via intestinal lacteals."
            ],
            cellType: "Leukocytes (B and T Lymphocytes, Macrophages)",
            cellParts: [
                "B Lymphocytes: Differentiate into plasma cells capable of secreting high-affinity antibodies (immunoglobulins).",
                "T Lymphocytes: CD8+ Cytotoxic T-cells directly kill infected cells; CD4+ Helper T-cells orchestrate immune responses.",
                "Macrophages: Professional phagocytes equipped with pattern recognition receptors (PRRs) and lysosomal enzymes."
            ],
            illnesses: [
                "HIV / AIDS: Human Immunodeficiency Virus selectively infects and depletes CD4+ T-helper cells, leading to profound immunodeficiency.",
                "Systemic Lupus Erythematosus (SLE): Autoimmune disorder involving antinuclear autoantibodies causing multi-organ immune complex deposition.",
                "Lymphoma: Hematologic malignancy arising from clonal expansion of neoplastic lymphocytes within lymphoid tissues."
            ]
        },
        endocrine: {
            title: "9. Endocrine System",
            desc: "Regulates long-term physiological processes by secreting chemical messengers (hormones) into circulation.",
            organs: [
                "Pituitary Gland: Master gland governed by the hypothalamus, controlling peripheral endocrine target glands.",
                "Thyroid Gland: Secretes thyroxine (T4) and triiodothyronine (T3), key regulators of basal metabolic rate.",
                "Adrenal Glands: Cortex secretes steroid hormones (cortisol, aldosterone); medulla secretes catecholamines (epinephrine, norepinephrine).",
                "Pancreas: Endocrine Islets of Langerhans contain alpha and beta cells regulating glucose homeostasis."
            ],
            functions: [
                "Homeostatic regulation of blood glucose, serum electrolytes, water balance, and arterial pressure.",
                "Regulation of somatic growth, tissue differentiation, cellular metabolism, and reproductive cycles.",
                "Orchestration of the physiological stress response (HPA axis activation)."
            ],
            cellType: "Pancreatic Beta Cell",
            cellParts: [
                "Extensive rough endoplasmic reticulum and Golgi apparatus specialized for preproinsulin synthesis and processing.",
                "Zinc-rich dense-core secretory granules storing mature insulin for glucose-stimulated exocytosis.",
                "ATP-sensitive K+ channels and voltage-gated Ca2+ channels coupling extracellular glucose levels to insulin secretion."
            ],
            illnesses: [
                "Diabetes Mellitus: Type 1 (autoimmune destruction of beta cells) or Type 2 (peripheral insulin resistance), resulting in chronic hyperglycemia.",
                "Hypothyroidism: Deficient thyroid hormone production causing metabolic slowing, lethargy, and weight gain.",
                "Cushing's Syndrome: Constellation of clinical signs resulting from chronic glucocorticoid excess."
            ]
        },
        urinary: {
            title: "10. Urinary System",
            desc: "Filters metabolic waste products from blood, regulates fluid-electrolyte balance, and controls blood pressure.",
            organs: [
                "Kidneys: Paired retroperitoneal organs containing ~1 million functional nephron units each.",
                "Ureters: Muscular tubes that propel urine from renal pelvis to bladder via peristalsis.",
                "Urinary Bladder: Distensible muscular reservoir lined with transitional epithelium.",
                "Urethra: Terminal canal for urine excretion."
            ],
            functions: [
                "Glomerular filtration, tubular reabsorption, and secretion to excrete metabolic wastes (urea, uric acid, creatinine).",
                "Regulation of blood volume and blood pressure via the Renin-Angiotensin-Aldosterone System (RAAS).",
                "Maintenance of plasma osmolarity, electrolyte concentrations (Na+, K+, Ca2+), and acid-base balance."
            ],
            cellType: "Podocyte (Visceral Epithelial Cell of Bowman's Capsule)",
            cellParts: [
                "Extends interdigitating primary and secondary foot processes (pedicels) around glomerular capillaries.",
                "Form filtration slits bridged by slit diaphragms (nephrin-based) constituting the final macromolecular filtration barrier."
            ],
            illnesses: [
                "Urolithiasis (Kidney Stones): Formation of crystalline mineral deposits (most commonly calcium oxalate) within the renal collecting system.",
                "Chronic Kidney Disease (CKD): Progressive, irreversible loss of functioning nephrons resulting in uremia and end-stage renal disease.",
                "Pyelonephritis: Severe bacterial infection of the renal parenchyma and pelvis, typically ascending from the lower urinary tract."
            ]
        },
        reproductive: {
            title: "11. Reproductive System",
            desc: "Produces haploid gametes, synthesizes sex steroids, and enables biological reproduction.",
            organs: [
                "Male Organs: Testes (sperm and testosterone production), Epididymis, Vas Deferens, Prostate, and Seminal Vesicles.",
                "Female Organs: Ovaries (oocyte maturation and estrogen/progesterone synthesis), Fallopian Tubes, Uterus, and Vagina."
            ],
            functions: [
                "Gametogenesis: Meiotic production of haploid spermatozoa and oocytes.",
                "Secretion of sex hormones driving primary and secondary sexual characteristics and reproductive cycles.",
                "Gestation, fetal development support, and parturition (female)."
            ],
            cellType: "Spermatozoon and Oocyte",
            cellParts: [
                "Spermatozoon: Compact cell with an acrosomal cap (containing hydrolytic enzymes), a mitochondrial midpiece, and a flagellar tail for motility.",
                "Oocyte: Large, nutrient-dense cell surrounded by the extracellular zona pellucida and corona radiata cells."
            ],
            illnesses: [
                "Polycystic Ovary Syndrome (PCOS): Complex endocrine disorder marked by anovulation, hyperandrogenism, and polycystic ovarian morphology.",
                "Endometriosis: Pathological presence of ectopic endometrial tissue outside the uterine cavity causing chronic pelvic pain and inflammation.",
                "Benign Prostatic Hyperplasia (BPH): Non-malignant enlargement of the prostate gland causing lower urinary tract obstruction in aging males."
            ]
        }
    }
};

export const systemOrder = [
    "circulatory",
    "respiratory",
    "digestive",
    "nervous",
    "skeletal",
    "muscular",
    "integumentary",
    "immune",
    "endocrine",
    "urinary",
    "reproductive"
];

export const systemMeta = {
    circulatory: {
        icon: "circulatory.svg",
        accent: "#ff4d6d",
        bs: {
            tldr: "Srce pumpa, sudovi dostavljaju. Kisik unutra, otpad van.",
            hook: "Ako trčiš, dižeš ruke ili piješ kafu — ovo je sistem koji to osjeća kao ritam.",
            mnemonic: "SAVE: Srce, Arterije (od srca), Vene (ka srcu), Exchange u kapilarima."
        },
        en: {
            tldr: "Heart pumps. Vessels deliver. Oxygen in, waste out.",
            hook: "Sprints, concerts, caffeine — this is the beat you feel in your chest.",
            mnemonic: "SAVE: Heart, Arteries (away), Veins (to heart), Exchange in capillaries."
        }
    },
    respiratory: {
        icon: "respiratory.svg",
        accent: "#3ee0c5",
        bs: {
            tldr: "Pluća mijenjaju O2 i CO2. Alveole su sitne mjehuriće razmjene.",
            hook: "Kad učiš do 2 ujutro, mozak jede kisik. Loš zrak i vape nisu 'neutralni'.",
            mnemonic: "NGTBA: Nos → Grkljan → Dušnik → Bronhi → Alveole."
        },
        en: {
            tldr: "Lungs swap O2 and CO2. Alveoli are the tiny exchange balloons.",
            hook: "Late-night studying burns oxygen. Vapes and smoke are not a vibe for alveoli.",
            mnemonic: "PATH: Nose → Larynx → Trachea → Bronchi → Alveoli."
        }
    },
    digestive: {
        icon: "digestive.svg",
        accent: "#ffb020",
        bs: {
            tldr: "Usitni, razgradi, upij, izbaci. Tanko crijevo = glavni shop nutrijenata.",
            hook: "Energy drink + skip lunch nije 'grindset' — jetra i želudac to naplaćuju kasnije.",
            mnemonic: "MJTC: Usta → Jednjak → Želudac → Tanko → Debelo."
        },
        en: {
            tldr: "Break it down, absorb it, dump the rest. Small intestine is the nutrient shop.",
            hook: "Energy drinks and skipped meals are not a grindset. Your liver keeps the receipt.",
            mnemonic: "MESS: Mouth → Esophagus → Stomach → Small → Large intestine."
        }
    },
    nervous: {
        icon: "nervous.svg",
        accent: "#a78bfa",
        bs: {
            tldr: "Neuroni šalju brze signale. Mozak planira, kičma izvršava reflekse.",
            hook: "Sleep, scroll i stres mijenjaju tvoju pažnju brže nego što misliš.",
            mnemonic: "SAM: Sensory in, Association (mozak), Motor out."
        },
        en: {
            tldr: "Neurons fire fast. Brain plans, spinal cord handles reflexes.",
            hook: "Sleep, doomscrolling, and stress rewrite your attention more than you notice.",
            mnemonic: "SAM: Sensory in, Association (brain), Motor out."
        }
    },
    skeletal: {
        icon: "skeletal.svg",
        accent: "#e2e8f0",
        bs: {
            tldr: "206 kostiju, zglobovi, srž pravi krv. Kalcijum živi ovdje.",
            hook: "Ako ne jedeš i ne dižeš ništa, kosti misle da ti nisu potrebne.",
            mnemonic: "206 + srž + Ca2+. Aksijalni štiti, apendikularni pomiče."
        },
        en: {
            tldr: "206 bones, joints, marrow makes blood. Calcium lives here.",
            hook: "Skip food and lifting and your bones assume you don't need them.",
            mnemonic: "206 + marrow + Ca2+. Axial protects, appendicular moves."
        }
    },
    muscular: {
        icon: "muscular.svg",
        accent: "#fb7185",
        bs: {
            tldr: "Tri tipa: skeletni (voljni), glatki, srčani. ATP + Ca2+ = kontrakcija.",
            hook: "Gym, ples, hodanje do škole — mišići su tvoj originalni wearable.",
            mnemonic: "ACTIN-MYOSIN: kalcijum otključa, ATP plati račun."
        },
        en: {
            tldr: "Three types: skeletal (voluntary), smooth, cardiac. ATP + Ca2+ = contract.",
            hook: "Gym, dance, walking to class — muscle is your original wearable.",
            mnemonic: "ACTIN-MYOSIN: calcium unlocks, ATP pays the bill."
        }
    },
    integumentary: {
        icon: "integumentary.svg",
        accent: "#f59e0b",
        bs: {
            tldr: "Koža je najveći organ: barijera, vitamin D, temperatura.",
            hook: "SPF nije 'anti-fun'. Melanom ne pita jesu li tvoji 18 ili 80.",
            mnemonic: "EDH: Epidermis (štiti), Dermis (živi sloj), Hipodermis (jastuk)."
        },
        en: {
            tldr: "Skin is the largest organ: barrier, vitamin D, temperature.",
            hook: "SPF is not anti-fun. Melanoma does not care if you are 18 or 80.",
            mnemonic: "EDH: Epidermis (shield), Dermis (living layer), Hypodermis (cushion)."
        }
    },
    immune: {
        icon: "immune.svg",
        accent: "#34d399",
        bs: {
            tldr: "Limfa + bijela krvna zrna. B prave antitijela, T napadaju zaražene ćelije.",
            hook: "Vakcine trenira ovaj sistem da ne paniči kad stvarni virus dođe.",
            mnemonic: "B = antitijela (Body fluids), T = Touch & kill zaražene ćelije."
        },
        en: {
            tldr: "Lymph + white cells. B makes antibodies, T hunts infected cells.",
            hook: "Vaccines train this system so it doesn't panic when the real virus shows up.",
            mnemonic: "B = antibodies (Body fluids), T = Touch-and-kill infected cells."
        }
    },
    endocrine: {
        icon: "endocrine.svg",
        accent: "#f472b6",
        bs: {
            tldr: "Hormoni u krvi = sporiji, duži Wi-Fi tijela. Insulin, tiroksin, kortizol.",
            hook: "Pubertet, ciklus, stres pred ispit — ovo je hemijski chat tvojeg tijela.",
            mnemonic: "HIT PAN: Hipofiza, Insulin, Tiroidea, Pankreas, Adrenal, Nadbubrežne."
        },
        en: {
            tldr: "Hormones in blood = slower, longer Wi-Fi for the body. Insulin, thyroxine, cortisol.",
            hook: "Puberty, cycles, exam stress — this is your body's group chat in chemicals.",
            mnemonic: "PIT-TAP: Pituitary, Insulin, Thyroid, Adrenals, Pancreas."
        }
    },
    urinary: {
        icon: "urinary.svg",
        accent: "#38bdf8",
        bs: {
            tldr: "Bubrezi filtriraju krv, prave urin, čuvaju pritisak i pH.",
            hook: "Dehydrate-maxing za 'look' nije flex. Bubrezi vole vodu, ne samo kafu.",
            mnemonic: "KUBU: Bubrezi → Ureteri → Mjehur → Uretra."
        },
        en: {
            tldr: "Kidneys filter blood, make urine, guard pressure and pH.",
            hook: "Dehydrate-maxing for a look is not a flex. Kidneys want water, not only coffee.",
            mnemonic: "KUBU: Kidneys → Ureters → Bladder → Urethra."
        }
    },
    reproductive: {
        icon: "reproductive.svg",
        accent: "#c084fc",
        bs: {
            tldr: "Gamete + hormoni. Testisi/jajnici rade i ćelije i steroidne signale.",
            hook: "PCOS, endometrioza, zdravlje prostate — ovo je zdravlje, ne tabu za ispit.",
            mnemonic: "GO: Gamete (haploid), Organi, hormoni (estrogen/testosteron)."
        },
        en: {
            tldr: "Gametes + hormones. Testes/ovaries make cells and steroid signals.",
            hook: "PCOS, endometriosis, prostate health — exam content, not a taboo.",
            mnemonic: "GO: Gametes (haploid) + Organs + hormones (estrogen/testosterone)."
        }
    }
};

export function getSystem(lang, key) {
    const base = anatomyDatabase[lang][key];
    const meta = systemMeta[key];
    const loc = meta[lang];
    return {
        key,
        ...base,
        icon: meta.icon,
        accent: meta.accent,
        tldr: loc.tldr,
        hook: loc.hook,
        mnemonic: loc.mnemonic,
        overviewSvg: `assets/svg/diagrams/system-${key}.svg`,
        cellSvg: `assets/svg/diagrams/cell-${key}.svg`
    };
}

