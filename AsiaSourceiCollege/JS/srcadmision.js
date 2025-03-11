document.addEventListener('DOMContentLoaded', function () {
    const alertMessage = document.getElementById('alert-message');
    const customAlert = document.getElementById('customAlert');
    const form = document.forms['admissionForm'];
    const submitButton = document.getElementById('submit-form'); 
    const okButton = document.getElementById('okButton');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const { jsPDF } = window.jspdf;
    let isValidationError = false;

    // Initialize select styles
    const selectElements = document.querySelectorAll('select');
    selectElements.forEach(select => {
        function updateSelectStyle() {
            const selectedValue = select.value;
            select.style.color = selectedValue === '' ? '#605e5e' : 'black';
        }
        updateSelectStyle();
        select.addEventListener('change', updateSelectStyle);
    });

    // Handle birthdate input
    const birthdateInput = document.getElementById('birthdate');
    birthdateInput.addEventListener('focus', function() {
        this.type = 'date';
    });
    birthdateInput.addEventListener('blur', function() {
        if (!this.value) {
            this.type = 'text';
        }
    });

    // Form step management
    const formSteps = document.querySelectorAll('.form-step');
    let currentStep = 0;

    function showStep(stepIndex) {
        console.log(`Showing step ${stepIndex}`);
        formSteps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        currentStep = stepIndex;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function validateStep(stepIndex) {
        console.log(`Validating step ${stepIndex}`);
        const currentStepElement = formSteps[stepIndex];
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        const errorMessages = [];
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                errorMessages.push(`Please check the ${input.previousElementSibling.textContent} field.`);
            }
        });
    
        if (errorMessages.length > 0) {
            alertMessage.textContent = errorMessages.join(' ');
            isValidationError = true; // Set the state variable
            showCustomAlert();
            return false;
        }
        isValidationError = false; // Reset if valid
        return true;
    }

    //map 2.0
const REGIONS = {
    "Region I - Ilocos Region": {
        "ilocos Norte": ["Laoag", "Batac", "Adams", "Bacarra", "Badoc", "Bangui", "Banna (Espiritu)", "Burgos", "Carasi", "Currimao", "Dingras", "Dumalneg", "Marcos", "Nueva Era", "Pagudpud", "Paoay", "Pasuquin", "Piddig", "Pinili", "San Nicolas", "Sarrat", "Solsona", "Vintar"],
        "ilocos Sur": ["Vigan", "Candon", "Alilem", "Banayoyo", "Bantay", "Burgos", "Cabugao", "Caoayan", "Cervantes", "Galimuyod", "Gregorio Del Pilar (Concepcion)", "Lidlidda", "Magsingal", "Nagbukel", "Narvacan", "Quirino (Angkaki)", "Salcedo (Baugen)", "San Emilio", "San Esteban", "San Ildefonso", "San Juan (Lapog)", "San Vicente", "Santa", "Santa Catalina", "Santa Cruz", "Santa Lucia", "Santa Maria", "Santiago", "Santo Domingo", "Sigay", "Sinait", "Sugpon", "Suyo", "Tagudin"],
        "la Union": ["San Fernando", "Agoo", "Aringay", "Bacnotan", "Bagulin", "Balaoan", "Bangar", "Bauang", "Burgos", "Caba", "Luna", "Naguilian", "Pugo", "Rosario", "San Gabriel", "San Juan", "Santo Tomas", "Santol", "Sudipen", "Tubao"],
        "pangasinan": ["Dagupan", "San Carlos", "Alaminos", "Urdaneta", "Agno", "Aguilar", "Alcala", "Anda", "Asingan", "Balungao", "Bani", "Basista", "Bautista", "Bayambang", "Binalonan", "Binmaley", "Bolinao", "Bugallon", "Burgos", "Calasiao", "Dasol", "Infanta", "Labrador", "Laoac", "Lingayen", "Mabini", "Malasiqui", "Manaoag", "Mangaldan", "Mangatarem", "Mapandan", "Natividad", "Pozorrubio", "Rosales", "San Fabian", "San Jacinto", "San Manuel", "San Nicolas", "San Quintin", "Santa Barbara", "Santa Maria", "Santo Tomas", "Sison", "Sual", "Tayug", "Umingan", "Urbiztondo", "Villasis"]
    },
    "Region II - Cagayan Valley": {
        "batanes": ["Basco", "Itbayat", "Ivana", "Mahatao", "Sabtang", "Uyugan"],
        "cagayan": ["Tuguegarao", "Aparri", "Abulug", "Alcala", "Allacapan", "Amulung", "Baggao", "Ballesteros", "Buguey", "Calayan", "Camalaniugan", "Claveria", "Enrile", "Gattaran", "Gonzaga", "Iguig", "Lal-lo", "Lasam", "Pamplona", "Peñablanca", "Piat", "Rizal", "Sanchez-Mira", "Santa Ana", "Santa Praxedes", "Santa Teresita", "Santo Niño (Faire)", "Solana", "Tuao"],
        "isabela": ["Ilagan", "Cauayan", "Alicia", "Angadanan", "Aurora", "Benito Soliven", "Burgos", "Cabagan", "Cabatuan", "Cordon", "Delfin Albano (Magsaysay)", "Dinapigue", "Divilacan", "Echague", "Gamu", "Jones", "Luna", "Maconacon", "Mallig", "Naguilian", "Palanan", "Quezon", "Quirino", "Ramon", "Reina Mercedes", "Roxas", "San Agustin", "San Guillermo", "San Isidro", "San Manuel", "San Mariano", "San Mateo", "San Pablo", "Santa Maria", "Santiago", "Santo Tomas", "Tumauini"],
        "nueva Vizcaya": ["Bayombong", "Alfonso Castañeda", "Ambaguio", "Aritao", "Bagabag", "Bambang", "Diadi", "Dupax del Norte", "Dupax del Sur", "Kasibu", "Kayapa", "Quezon", "Santa Fe", "Solano", "Villaverde"],
        "quirino": ["Cabarroguis", "Aglipay", "Diffun", "Maddela", "Nagtipunan", "Saguday"]
    },
    "Region III - Central Luzon": {
        "aurora": ["Baler", "Casiguran", "Dilasag", "Dinalungan", "Dingalan", "Maria Aurora", "San Luis"],
        "bataan": ["Balanga", "Abucay", "Bagac", "Dinalupihan", "Hermosa", "Limay", "Mariveles", "Morong", "Orani", "Orion", "Pilar", "Samal"],
        "bulacan": ["Malolos", "Meycauayan", "San Jose del Monte", "Angat", "Balagtas (Bigaa)", "Baliuag", "Bocaue", "Bulacan", "Bustos", "Calumpit", "Doña Remedios Trinidad", "Guiguinto", "Hagonoy", "Marilao", "Norzagaray", "Obando", "Pandi", "Paombong", "Plaridel", "Pulilan", "San Ildefonso", "San Miguel", "San Rafael", "Santa Maria"],
        "nueva Ecija": ["Cabanatuan", "Gapan", "Muñoz", "Palayan", "San Jose", "Aliaga", "Bongabon", "Cabiao", "Carranglan", "Cuyapo", "Gabaldon (Bitulok & Sabani)", "General Mamerto Natividad", "General Tinio (Papaya)", "Guimba", "Jaen", "Laur", "Licab", "Llanera", "Lupao", "Nampicuan", "Pantabangan", "Peñaranda", "Quezon", "Rizal", "San Antonio", "San Isidro", "San Leonardo", "Santa Rosa", "Santo Domingo", "Talavera", "Talugtug", "Zaragoza"],
        "pampanga": ["Angeles", "San Fernando", "Apalit", "Arayat", "Bacolor", "Candaba", "Floridablanca", "Guagua", "Lubao", "Mabalacat", "Macabebe", "Magalang", "Masantol", "Mexico", "Minalin", "Porac", "San Luis", "San Simon", "Santa Ana", "Santa Rita", "Santo Tomas", "Sasmuan"],
        "tarlac": ["Tarlac", "Anao", "Bamban", "Camiling", "Capas", "Concepcion", "Gerona", "La Paz", "Mayantoc", "Moncada", "Paniqui", "Pura", "Ramos", "San Clemente", "San Jose", "San Manuel", "Santa Ignacia", "Victoria"],
        "zambales": ["Olongapo", "Botolan", "Cabangan", "Candelaria", "Castillejos", "Iba", "Masinloc", "Palauig", "San Antonio", "San Felipe", "San Marcelino", "San Narciso", "Santa Cruz", "Subic"]
    },
    "Region IV-A - CALABARZON": {
        "batangas": ["Batangas", "Lipa", "Tanauan", "Agoncillo", "Alitagtag", "Balayan", "Balete", "Bauan", "Calaca", "Calatagan", "Cuenca", "Ibaan", "Laurel", "Lemery", "Lian", "Lobo", "Mabini", "Malvar", "Mataasnakahoy", "Nasugbu", "Padre Garcia", "Rosario", "San Jose", "San Juan", "San Luis", "San Nicolas", "San Pascual", "Santa Teresita", "Santo Tomas", "Taal", "Talisay", "Taysan", "Tingloy", "Tuy"],
        "cavite": ["Cavite City", "Tagaytay", "Trece Martires", "Alfonso", "Amadeo", "Bacoor", "Carmona", "Dasmariñas", "Gen. Emilio Aguinaldo", "Gen. Mariano Alvarez", "Gen. Trias", "Imus", "Indang", "Kawit", "Magallanes", "Maragondon", "Mendez", "Naic", "Noveleta", "Rosario", "Silang", "Tanza", "Ternate"],
        "laguna": ["Santa Rosa", "Calamba", "San Pedro", "Biñan", "Alaminos", "Bay", "Cabuyao", "Calauan", "Cavinti", "Famy", "Kalayaan", "Liliw", "Los Baños", "Luisiana", "Lumban", "Mabitac", "Magdalena", "Majayjay", "Nagcarlan", "Paete", "Pagsanjan", "Pakil", "Pangil", "Pila", "Rizal", "San Pablo", "Santa Cruz", "Santa Maria", "Siniloan", "Victoria"],
        "quezon": ["Lucena", "Tayabas", "Agdangan", "Alabat", "Atimonan", "Buenavista", "Burdeos", "Calauag", "Candelaria", "Catanauan", "Dolores", "General Luna", "General Nakar", "Guinayangan", "Gumaca", "Infanta", "Jomalig", "Lopez", "Lucban", "Macalelon", "Mauban", "Mulanay", "Padre Burgos", "Pagbilao", "Panukulan", "Patnanungan", "Perez", "Pitogo", "Plaridel", "Polillo", "Quezon", "Real", "Sampaloc", "San Andres", "San Antonio", "San Francisco (Aurora)", "San Narciso", "Sariaya", "Tagkawayan", "Tiaong", "Unisan"],
        "rizal": ["Antipolo", "Angono", "Baras", "Binangonan", "Cainta", "Cardona", "Jalajala", "Morong", "Pililla", "Rodriguez (Montalban)", "San Mateo", "Tanay", "Taytay", "Teresa"]
    },
    "Region IV-B - MIMAROPA": {
        "marinduque": ["Boac", "Buenavista", "Gasan", "Mogpog", "Santa Cruz", "Torrijos"],
        "occidental Mindoro": ["Mamburao", "Abra de Ilog", "Calintaan", "Looc", "Lubang", "Magsaysay", "Paluan", "Rizal", "Sablayan", "San Jose", "Santa Cruz"],
        "oriental Mindoro": ["Calapan", "Baco", "Bansud", "Bongabong", "Bulalacao (San Pedro)", "Gloria", "Mansalay", "Naujan", "Pinamalayan", "Pola", "Puerto Galera", "Roxas", "San Teodoro", "Socorro", "Victoria"],
        "palawan": ["Puerto Princesa", "Aborlan", "Agutaya", "Araceli", "Balabac", "Bataraza", "Brooke's Point", "Busuanga", "Cagayancillo", "Coron", "Culion", "Cuyo", "Dumaran", "El Nido (Bacuit)", "Kalayaan", "Linapacan", "Magsaysay", "Narra", "Quezon", "Rizal (Marcos)", "Roxas", "San Vicente", "Sofronio Española", "Taytay"],
        "romblon": ["Romblon", "Alcantara", "Banton", "Cajidiocan", "Calatrava", "Concepcion", "Corcuera", "Ferrol", "Looc", "Magdiwang", "Odiongan", "San Agustin", "San Andres", "San Fernando", "San Jose", "Santa Fe", "Santa Maria (Imelda)"]
    },
    "Region V - Bicol Region": {
        "albay": ["Legazpi", "Ligao", "Tabaco", "Bacacay", "Camalig", "Daraga (Locsin)", "Guinobatan", "Jovellar", "Libon", "Malilipot", "Malinao", "Manito", "Oas", "Pio Duran", "Polangui", "Rapu-Rapu", "Santo Domingo (Libog)", "Tiwi"],
        "camarines Norte": ["Daet", "Basud", "Capalonga", "Jose Panganiban", "Labo", "Mercedes", "Paracale", "San Lorenzo Ruiz (Imelda)", "San Vicente", "Santa Elena", "Talisay", "Vinzons"],
        "camarines Sur": ["Naga", "Iriga", "Baao", "Balatan", "Bato", "Bombon", "Buhi", "Bula", "Cabusao", "Calabanga", "Camaligan", "Canaman", "Caramoan", "Del Gallego", "Gainza", "Garchitorena", "Goa", "Lagonoy", "Libmanan", "Lupi", "Magarao", "Milaor", "Minalabac", "Nabua", "Ocampo", "Pamplona", "Pasacao", "Pili", "Presentacion (Parubcan)", "Ragay", "Sagñay", "San Fernando", "San Jose", "Sipocot", "Siruma", "Tigaon", "Tinambac"],
        "catanduanes": ["Virac", "Bagamanoc", "Baras", "Bato", "Caramoran", "Gigmoto", "Pandan", "Panganiban (Payo)", "San Andres (Calolbon)", "San Miguel", "Viga"],
        "masbate": ["Masbate", "Aroroy", "Baleno", "Balud", "Batuan", "Cataingan", "Cawayan", "Claveria", "Dimasalang", "Esperanza", "Mandaon", "Milagros", "Mobo", "Monreal", "Palanas", "Pio V. Corpuz (Limbuhan)", "Placer", "San Fernando", "San Jacinto", "San Pascual", "Uson"],
        "sorsogon": ["Sorsogon", "Barcelona", "Bulan", "Bulusan", "Casiguran", "Castilla", "Donsol", "Gubat", "Irosin", "Juban", "Magallanes", "Matnog", "Pilar", "Prieto Diaz", "Santa Magdalena"]
    },
    "Region VI - Western Visayas": {
        "aklan": ["Kalibo", "Altavas", "Balete", "Banga", "Batan", "Buruanga", "Ibajay", "Lezo", "Libacao", "Madalag", "Makato", "Malay", "Malinao", "Nabas", "New Washington", "Numancia", "Tangalan"],
        "antique": ["San Jose", "Anini-y", "Barbaza", "Belison", "Bugasong", "Caluya", "Culasi", "Hamtic", "Laua-an", "Libertad", "Pandan", "Patnongon", "San Remigio", "Sebaste", "Sibalom", "Tibiao", "Tobias Fornier (Dao)", "Valderrama"],
        "capiz": ["Roxas", "Cuartero", "Dao", "Dumalag", "Dumarao", "Ivisan", "Jamindan", "Ma-ayon", "Mambusao", "Panay", "Panitan", "Pilar", "Pontevedra", "President Roxas", "Sapian", "Sigma", "Tapaz"],
        "guimaras": ["Jordan", "Buenavista", "Nueva Valencia", "San Lorenzo", "Sibunag"],
        "iloilo": ["Iloilo City", "Passi", "Ajuy", "Alimodian", "Anilao", "Badiangan", "Balasan", "Banate", "Barotac Nuevo", "Barotac Viejo", "Batad", "Bingawan", "Cabatuan", "Calinog", "Carles", "Concepcion", "Dingle", "Dueñas", "Dumangas", "Estancia", "Guimbal", "Igbaras", "Janiuay", "Lambunao", "Leganes", "Lemery", "Leon", "Maasin", "Miagao", "Mina", "New Lucena", "Oton", "Pavia", "Pototan", "San Dionisio", "San Enrique", "San Joaquin", "San Miguel", "San Rafael", "Santa Barbara", "Sara", "Tigbauan", "Tubungan", "Zarraga"],
        "negros Occidental": ["Bacolod", "Bago", "Cadiz", "Escalante", "Himamaylan", "Kabankalan", "La Carlota", "Sagay", "San Carlos", "Silay", "Sipalay", "Talisay", "Victorias", "Binalbagan", "Calatrava", "Candoni", "Cauayan", "Enrique B. Magalona (Saravia)", "Hinigaran", "Hinoba-an (Asia)", "Ilog", "Isabela", "La Castellana", "Manapla", "Moises Padilla (Magallon)", "Murcia", "Pontevedra", "Pulupandan", "Salvador Benedicto", "San Enrique", "Toboso", "Valladolid"],
    },
    "Region VII - Central Visayas": {
        "Bohol": ["Tagbilaran", "Alburquerque", "Alicia", "Anda", "Antequera", "Baclayon", "Balilihan", "Batuan", "Bien Unido", "Bilar", "Buenavista", "Calape", "Candijay", "Carmen", "Catigbian", "Clarin", "Corella", "Cortes", "Dagohoy", "Danao", "Dauis", "Dimiao", "Duero", "Garcia Hernandez", "Getafe", "Guindulman", "Inabanga", "Jagna", "Lila", "Loay", "Loboc", "Loon", "Mabini", "Maribojoc", "Panglao", "Pilar", "President Carlos P. Garcia (Pitogo)", "Sagbayan (Borja)", "San Isidro", "San Miguel", "Sevilla", "Sierra Bullones", "Sikatuna", "Talibon", "Trinidad", "Tubigon", "Ubay", "Valencia"],
        "Cebu": ["Cebu City", "Danao", "Lapu-Lapu", "Mandaue", "Talisay", "Toledo", "Alcantara", "Alcoy", "Alegria", "Aloguinsan", "Argao", "Asturias", "Badian", "Balamban", "Bantayan", "Barili", "Boljoon", "Borbon", "Carcar", "Carmen", "Catmon", "Compostela", "Consolacion", "Cordova", "Daanbantayan", "Dalaguete", "Dumanjug", "Ginatilan", "Liloan", "Madridejos", "Malabuyoc", "Medellin", "Minglanilla", "Moalboal", "Naga", "Oslob", "Pilar", "Pinamungajan", "Poro", "Ronda", "Samboan", "San Fernando", "San Francisco", "San Remigio", "Santa Fe", "Santander", "Sibonga", "Sogod", "Tabogon", "Tabuelan", "Tuburan", "Tudela"],
        "Negros Oriental": ["Dumaguete", "Amlan (Ayuquitan)", "Ayungon", "Bacong", "Bais", "Basay", "Bayawan (Tulong)", "Bindoy (Payabon)", "Canlaon", "Dauin", "Guihulngan", "Jimalalud", "La Libertad", "Mabinay", "Manjuyod", "Pamplona", "San Jose", "Santa Catalina", "Siaton", "Sibulan", "Tanjay", "Tayasan", "Valencia (Luzurriaga)", "Vallehermoso", "Zamboanguita"],
        "Siquijor": ["Siquijor", "Enrique Villanueva", "Larena", "Lazi", "Maria", "San Juan"]
    },
    "Region VIII - Eastern Visayas": {
        "Biliran": ["Naval", "Almeria", "Biliran", "Cabucgayan", "Caibiran", "Culaba", "Kawayan", "Maripipi"],
        "Eastern Samar": ["Borongan", "Arteche", "Balangiga", "Balangkayan", "Can-avid", "Dolores", "General MacArthur", "Giporlos", "Guiuan", "Hernani", "Jipapad", "Lawaan", "Llorente", "Maslog", "Maydolong", "Mercedes", "Oras", "Quinapondan", "Salcedo", "San Julian", "San Policarpo", "Sulat", "Taft"],
        "Leyte": ["Tacloban", "Abuyog", "Alangalang", "Albuera", "Babatngon", "Barugo", "Bato", "Baybay", "Burauen", "Calubian", "Capoocan", "Carigara", "Dagami", "Dulag", "Hilongos", "Hindang", "Inopacan", "Isabel", "Jaro", "Javier (Bugho)", "Julita", "Kananga", "La Paz", "Leyte", "MacArthur", "Mahaplag", "Matag-ob", "Matalom", "Mayorga", "Merida", "Ormoc", "Palo", "Palompon", "Pastrana", "San Isidro", "San Miguel", "Santa Fe", "Tabango", "Tabontabon", "Tanauan", "Tolosa", "Tunga", "Villaba"],
        "Northern Samar": ["Catarman", "Allen", "Biri", "Bobon", "Capul", "Catubig", "Gamay", "Laoang", "Lapinig", "Las Navas", "Lavezares", "Lope de Vega", "Mapanas", "Mondragon", "Palapag", "Pambujan", "Rosario", "San Antonio", "San Isidro", "San Jose", "San Roque", "San Vicente", "Silvino Lobos", "Victoria"],
        "Western Samar(Samar)": ["Catbalogan", "Calbayog", "Almagro", "Basey", "Calbiga", "Daram", "Gandara", "Hinabangan", "Jiabong", "Marabut", "Matuguinao", "Motiong", "Pagsanghan", "Paranas (Wright)", "Pinabacdao", "San Jorge", "San Jose de Buan", "San Sebastian", "Santa Margarita", "Santa Rita", "Santo Niño", "Tagapul-an", "Talalora", "Tarangnan", "Villareal", "Zumarraga"],
        "Southern Leyte": ["Maasin", "Anahawan", "Bontoc", "Hinunangan", "Hinundayan", "Libagon", "Liloan", "Limasawa", "Macrohon", "Malitbog", "Padre Burgos", "Pintuyan", "Saint Bernard", "San Francisco", "San Juan (Cabalian)", "San Ricardo", "Silago", "Sogod", "Tomas Oppus"]
    },
    "Region IX - Zamboanga Peninsula": {
        "Zamboanga del Norte": ["Dipolog", "Dapitan", "Bacungan (Leon T. Postigo)", "Baliguian", "Godod", "Gutalac", "Jose Dalman (Ponot)", "Kalawit", "Katipunan", "La Libertad", "Labason", "Liloy", "Manukan", "Mutia", "Piñan (New Piñan)", "Polanco", "President Manuel A. Roxas", "Rizal", "Salug", "Sergio Osmeña Sr.", "Siayan", "Sibuco", "Sibutad", "Sindangan", "Siocon", "Sirawai", "Tampilisan"],
        "Zamboanga del Sur": ["Pagadian", "Zamboanga", "Aurora", "Bayog", "Dimataling", "Dinas", "Dumalinao", "Dumingag", "Guipos", "Josefina", "Kumalarang", "Labangan", "Lakewood", "Lapuyan", "Mahayag", "Margosatubig", "Midsalip", "Molave", "Pitogo", "Ramon Magsaysay (Liargo)", "San Miguel", "San Pablo", "Sominot (Don Mariano Marcos)", "Tabina", "Tambulig", "Tigbao", "Tukuran", "Vincenzo A. Sagun"],
        "Zamboanga Sibugay": ["Ipil", "Alicia", "Buug", "Diplahan", "Imelda", "Kabasalan", "Mabuhay", "Malangas", "Naga", "Olutanga", "Payao", "Roseller Lim", "Siay", "Talusan", "Titay", "Tungawan"]
    },
    "Region X - Northern Mindanao": {
        "Bukidnon": ["Malaybalay", "Valencia", "Baungon", "Cabanglasan", "Damulog", "Dangcagan", "Don Carlos", "Impasugong", "Kadingilan", "Kalilangan", "Kibawe", "Kitaotao", "Lantapan", "Libona", "Malitbog", "Manolo Fortich", "Maramag", "Pangantucan", "Quezon", "San Fernando", "Sumilao", "Talakag"],
        "Camiguin": ["Mambajao", "Catarman", "Guinsiliban", "Mahinog", "Sagay"],
        "Lanao del Norte": ["Iligan", "Bacolod", "Baloi", "Baroy", "Kapatagan", "Kauswagan", "Kolambugan", "Lala", "Linamon", "Magsaysay", "Maigo", "Matungao", "Munai", "Nunungan", "Pantao Ragat", "Pantar", "Poona Piagapo", "Salvador", "Sapad", "Sultan Naga Dimaporo (Karomatan)", "Tagoloan", "Tangcal", "Tubod"],
        "Misamis Occidental": ["Oroquieta", "Ozamiz", "Tangub", "Aloran", "Baliangao", "Bonifacio", "Calamba", "Clarin", "Concepcion", "Don Victoriano Chiongbian (Don Mariano Marcos)", "Jimenez", "Lopez Jaena", "Panaon", "Plaridel", "Sapang Dalaga", "Sinacaban", "Tudela"],
        "Misamis Oriental": ["Cagayan de Oro", "Gingoog", "Alubijid", "Balingasag", "Balingoan", "Binuangan", "Claveria", "El Salvador", "Gitagum", "Initao", "Jasaan", "Kinoguitan", "Lagonglong", "Laguindingan", "Libertad", "Lugait", "Magsaysay (Linugos)", "Manticao", "Medina", "Naawan", "Opol", "Salay", "Sugbongcogon", "Tagoloan", "Talisayan", "Villanueva"]
    },
    "Region XI - Davao Region": {
        "Davao de Oro": ["Nabunturan", "Compostela", "Laak (San Vicente)", "Mabini (Dona Alicia)", "Maco", "Maragusan (San Mariano)", "Mawab", "Monkayo", "Montevista", "New Bataan", "Pantukan"],
        "Davao del Norte": ["Tagum", "Panabo", "Samal (Island Garden)", "Asuncion (Saug)", "Braulio E. Dujali", "Carmen", "Kapalong", "New Corella", "San Isidro", "Santo Tomas", "Talaingod"],
        "Davao del Sur": ["Davao City", "Bansalan", "Digos", "Hagonoy", "Kiblawan", "Magsaysay", "Malalag", "Matanao", "Padada", "Santa Cruz", "Sulop"],
        "Davao Occidental": ["Malita", "Don Marcelino", "Jose Abad Santos (Trinidad)", "Santa Maria", "Sarangani"],
        "Davao Oriental": ["Mati", "Baganga", "Banaybanay", "Boston", "Caraga", "Cateel", "Governor Generoso", "Lupon", "Manay", "San Isidro", "Tarragona"]
    },
    "Region XII - SOCCSKSARGEN": {
        "Cotabato": ["Kidapawan", "Alamada", "Aleosan", "Antipas", "Arakan", "Banisilan", "Carmen", "Kabacan", "Libungan", "Magpet", "Makilala", "Matalam", "Midsayap", "M'lang", "Pigcawayan", "Pikit", "President Roxas", "Tulunan"],
        "Sarangani": ["Alabel", "Glan", "Kiamba", "Maasim", "Maitum", "Malapatan", "Malungon"],
        "South Cotabato": ["Koronadal", "General Santos", "Banga", "Lake Sebu", "Norala", "Polomolok", "Santo Niño", "Surallah", "Tampakan", "Tantangan", "Tupi"],
        "Sultan Kudarat": ["Isulan", "Tacurong", "Bagumbayan", "Columbio", "Esperanza", "Kalamansig", "Lambayong (Mariano Marcos)", "Lebak", "Lutayan", "Palimbang", "President Quirino", "Senator Ninoy Aquino"]
    },
    "Region XIII - Caraga": {
        "Agusan del Norte": ["Butuan", "Cabadbaran", "Buenavista", "Carmen", "Jabonga", "Kitcharao", "Las Nieves", "Magallanes", "Nasipit", "Remedios T. Romualdez", "Santiago", "Tubay"],
        "Agusan del Sur": ["San Francisco", "Bayugan", "Bunawan", "Esperanza", "La Paz", "Loreto", "Prosperidad", "Rosario", "San Luis", "Santa Josefa", "Sibagat", "Talacogon", "Trento", "Veruela"],
        "Dinagat Islands": ["San Jose", "Basilisa (Rizal)", "Cagdianao", "Dinagat", "Libjo (Albor)", "Loreto", "Tubajon"],
        "Surigao del Norte": ["Surigao City", "Alegria", "Bacuag", "Burgos", "Claver", "Dapa", "Del Carmen", "General Luna", "Gigaquit", "Mainit", "Malimono", "Pilar", "Placer", "San Benito", "San Francisco (Anao-aon)", "San Isidro", "Santa Monica (Sapao)", "Sison", "Socorro", "Tagana-an", "Tubod"],
        "Surigao del Sur": ["Tandag", "Bislig", "Barobo", "Bayabas", "Cagwait", "Cantilan", "Carmen", "Carrascal", "Cortes", "Hinatuan", "Lanuza", "Lianga", "Lingig", "Madrid", "Marihatag", "San Agustin", "San Miguel", "Tagbina", "Tago"]
    },
    "BARMM - Bangsamoro Autonomous Region in Muslim Mindanao": {
        "Basilan": ["Isabela", "Lamitan", "Akbar", "Al-Barka", "Hadji Mohammad Ajul", "Hadji Muhtamad", "Lantawan", "Maluso", "Sumisip", "Tabuan-Lasa", "Tipo-Tipo", "Tuburan", "Ungkaya Pukan"],
        "Lanao del Sur": ["Marawi", "Bacolod-Kalawi (Bacolod Grande)", "Balabagan", "Balindong (Watu)", "Bayang", "Binidayan", "Buadiposo-Buntong", "Bubong", "Bumbaran", "Butig", "Calanogas", "Ditsaan-Ramain", "Ganassi", "Kapai", "Kapatagan", "Lumba-Bayabao (Maguing)", "Lumbaca-Unayan", "Lumbatan", "Lumbayanague", "Madalum", "Madamba", "Maguing", "Malabang", "Marantao", "Marogong", "Masiu", "Mulondo", "Pagayawan (Tatarikan)", "Piagapo", "Poona Bayabao (Gata)", "Pualas", "Saguiaran", "Sultan Dumalondong", "Picong (Sultan Gumander)", "Tagoloan II", "Tamparan", "Taraka", "Tubaran", "Tugaya", "Wao"],
        "Maguindanao": ["Buluan", "Cotabato City", "Datu Odin Sinsuat", "Datu Piang", "Datu Paglas", "Gen. S. K. Pendatun", "Matanog", "Parang", "Shariff Aguak", "Sultan Kudarat", "Sultan sa Barongis"],
        "Sulu": ["Jolo", "Banguingui (Tongkil)", "Hadji Panglima Tahil (Marunggas)", "Indanan", "Kalingalan Caluang", "Lugus", "Luuk", "Maimbung", "Old Panamao", "Omar", "Pandami", "Panglima Estino (New Panamao)", "Pangutaran", "Parang", "Pata", "Patikul", "Siasi", "Talipao", "Tapul"],
        "Tawi-Tawi": ["Bongao", "Languyan", "Mapun (Cagayan de Tawi-Tawi)", "Panglima Sugala (Balimbing)", "Sapa-Sapa", "Simunul", "Sitangkai", "South Ubian", "Tandubas", "Turtle Islands"]
    },
"CAR - Cordillera Administrative Region": {
    "Abra": ["Bangued", "Boliney", "Bucloc", "Daguioman", "Dolores", "Lagayan", "Langiden", "Luba", "Malibcong", "Manabo", "Penarrubia", "Pidigan", "Pilar", "San Isidro", "San Juan", "San Quintin", "Tayum", "Tineg", "Villaviciosa"],
    "Apayao": ["Conner", "Flora", "Kabugao", "Luna", "Panaon", "Santa Marcela"],
    "Benguet": ["Atok", "Bakun", "Bakun", "Bokod", "Buguias", "Itogon", "Kabayan", "Kibungan", "La Trinidad", "Mankayan", "Sablan", "Tuba", "Tublay"],
    "Ifugao": ["Aguinaldo", "Alfonso Lista", "Asipulo", "Hingyon", "Hungduan", "Lamut", "Lagawe", "Lamut", "Natonin", "Potia", "Tinoc"],
    "Kalinga": ["Balbalan", "Balong", "Conner", "Pasil", "Pinukpuk", "Rizal", "Tabuk", "Tanudan"],
    "Mountain Province": ["Bauko", "Besao", "Bontoc", "Natonin", "Paracelis", "Sabangan", "Sadanga", "Sagada", "Tadian"]
},
"NCR - National Capital Region": {
    "Metro Manila": ["Caloocan", "Las Piñas", "Makati", "Malabon", "Mandaluyong", "Manila", "Marikina", "Muntinlupa", "Navotas", "Parañaque", "Pasay", "Pasig", "Quezon City", "San Juan", "Taguig", "Valenzuela", "Pateros"]
}
};

const regionSelect = document.getElementById('region');
const provinceSelect = document.getElementById('province');
const citySelect = document.getElementById('city');

// Populate the regions dropdown
for (const region in REGIONS) {
  const option = document.createElement('option');
  option.value = region;
  option.textContent = region;
  regionSelect.appendChild(option);
}

regionSelect.addEventListener('change', function () {
  provinceSelect.innerHTML = '<option value="">Select Province</option>';
  citySelect.innerHTML = '<option value="">Select City</option>';
  citySelect.disabled = true;

  if (this.value === "") {
    provinceSelect.disabled = true;
  } else {
    provinceSelect.disabled = false;
    const selectedRegion = REGIONS[this.value];
    for (const province in selectedRegion) {
      const option = document.createElement('option');
      option.value = province;
      option.textContent = province;
      provinceSelect.appendChild(option);
    }
  }
});

provinceSelect.addEventListener('change', function () {
  citySelect.innerHTML = '<option value="">Select City</option>';

  if (this.value === "") {
    citySelect.disabled = true;
  } else {
    citySelect.disabled = false;
    const selectedRegion = REGIONS[regionSelect.value];
    const selectedProvince = selectedRegion[this.value];
    for (const city of selectedProvince) {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    }
  }
});

    // Step navigation buttons
    document.getElementById('next-to-application').addEventListener('click', () => {
        console.log('Next to application');
        if (validateStep(0)) showStep(1);
    });
    document.getElementById('back-to-student-info').addEventListener('click', () => {
        console.log('Back to student info');
        showStep(0);
    });
    document.getElementById('next-to-address').addEventListener('click', () => {
        console.log('Next to address');
        if (validateStep(1)) showStep(2);
    });
    document.getElementById('back-to-application').addEventListener('click', () => {
        console.log('Back to application');
        showStep(1);
    });
    document.getElementById('next-to-guardian').addEventListener('click', () => {
        console.log('Next to guardian');
        if (validateStep(2)) showStep(3);
    });
    document.getElementById('back-to-address').addEventListener('click', () => {
        console.log('Back to address');
        showStep(2);
    });
    

// Assuming you have a dropdown for branch selection with id 'branch'
const branchSelect = document.getElementById('branch'); // Corrected ID to match HTML

// Form submission handling
form.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Form submission initiated');
    const errorMessages = [];
    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        if (!input.checkValidity()) {
            errorMessages.push(`Please check the ${input.previousElementSibling.textContent} field.`);
        }
    });

    if (errorMessages.length > 0) {
        alertMessage.textContent = errorMessages.join(' ');
        showCustomAlert();
        return;
    }

    if (!branchSelect) {
        alertMessage.textContent = 'Branch selection is required.';
        showCustomAlert();
        return;
    }
    
    const formData = new FormData(this); 

    const jsonData = {};
    formData.forEach((value, key) => jsonData[key] = value);

    // Set the sheet name based on the selected branch
    jsonData['sheetName'] = branchSelect.value === 'taguig' ? 'TaguigDatabase' : 'PasigDatabase'; // Adjusted sheet names

    console.log('Form data before sending:', jsonData);

    loadingOverlay.style.display = 'block';
    loadingIndicator.style.display = 'block';

    // Determine the Google Apps Script URL based on the selected branch
    let googleScriptUrl;
    if (branchSelect.value === 'taguig') {
        googleScriptUrl = 'https://script.google.com/macros/s/AKfycbxO8omdZ7NagPaKbbkbp7pNvv-z5_jDN4pBq140UwOVUEefgU9DHUdT5NWhlSfVb2Lc/exec'; // Taguig URL
    } else if (branchSelect.value === 'pasig') {
        googleScriptUrl = 'https://script.google.com/macros/s/AKfycby22I-y5J1KoeoSsviw4x7XFQnP82xAXLeZYAQS3qy1Kt9QIe_VLsMeHjVKKOKe2sYl/exec'; // Pasig URL
    } else {
        console.error('Invalid branch selected');
        alertMessage.textContent = 'Please select a valid branch.';
        showCustomAlert();
        return;
    }

    // First, send the data to your local server
    fetch('http://localhost:5501/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
    })
    .then(response => {
        console.log('Response status:', response.status); // Log the response status
        return response.json().then(data => {
            console.log('Response data:', data); // Log the response data
            if (!response.ok) {
                console.error('Server error:', data);
                throw new Error(data.error || 'Network response was not ok.');
            }
            return data; // Return the data if response is ok
        });
    })
    .then(data => {
        console.log('Response data after first fetch:', data); // Log the response data
        if (data.success) {
            // Send the data to the appropriate Google Apps Script for the selected branch
            return fetch(googleScriptUrl, {
                method: 'POST',
                body: new FormData(form) // Send the form data
            });
        } else {
            console.error('Form submission failed:', data.error);
            throw new Error(data.error || 'Form submission failed.');
        }
    })
    .then(response => {
        console.log('Response from Google Apps Script:', response.status); // Log the response status
        return response.json().then(data => {
            console.log('Response data from Google Apps Script:', data); // Log the response data
            if (!response.ok) {
                console.error('Error from Google Apps Script:', data);
                throw new Error(data.error || 'Network response was not ok.');
            }
            return data; // Return the data if response is ok
        });
    })
    .then(data => {
        // Check if the response from Google Apps Script has a 'result' property
        if (data.result === "success") {
            console.log('Response from email sending:', data);
            generatePDF(jsonData); // Pass the data to PDF generation
            alertMessage.textContent = "Successfully admitted! Check your email to proceed with the next step. Please upload the printed receipt.";
            showCustomAlert();
            form.reset(); // Optionally clear form fields
            resetToFirstStep();
            isValidationError = false;
        } else {
            console.error('Form submission failed:', data.error);
            throw new Error(data.error || 'Form submission failed.');
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alertMessage.textContent = 'There was an error submitting the form: ' + error.message;
        showCustomAlert();
    })
    .finally(() => {
        loadingOverlay.style.display = 'none';
        loadingIndicator.style.display = 'none';
        // Re-enable the submit button
        submitButton.disabled = false;
    });
});


    // pedofile
    function generatePDF() {
        console.log('Generating PDF');
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "legal", // Long bond paper size is 8.5" x 14" (legal size)
            putOnlyUsedFonts: true,
            floatPrecision: 16 // Optional, adjust for precision
        });
    
        const formData = new FormData(document.getElementById('admissionForm'));
    
      // Create an object to store the form data
      const data = {
        LASTNAME: formData.get('LASTNAME'),
        FIRSTNAME: formData.get('FIRSTNAME'),
        MIDDLEINITIAL: formData.get('MIDDLEINITIAL'),
        SUFFIX: formData.get('SUFFIX'),
        SEX: formData.get('SEX'),
        BIRTHDATE: formData.get('BIRTHDATE'),
        AGE: formData.get('AGE'),
        RELIGION: formData.get('RELIGION'),
        MOBILENUMBER: formData.get('MOBILENUMBER'),
        STUDENTEMAILADDRESS: formData.get('STUDENTEMAILADDRESS'),
        GRADELEVEL: formData.get('GRADELEVEL'),
        LRN: formData.get('LRN'),
        JUNIORHIGHSCHOOL: formData.get('JUNIORHIGHSCHOOL'),
        HIGHSCHOOLADDRESS: formData.get('HIGHSCHOOLADDRESS'),
        PREFERREDTRACK: formData.get('PREFERREDTRACK'),
        PREFERREDSTRAND: formData.get('PREFERREDSTRAND'),
        REGION: formData.get('REGION'),
        PROVINCE: formData.get('PROVINCE'),
        CITY: formData.get('CITY'),
        BARANGAY: formData.get('BARANGAY'),
        HOUSENO: formData.get('HOUSENO'),
        FATHERLASTNAME: formData.get('FATHERLASTNAME'),
        FATHERSUFFIX: formData.get('FATHERSUFFIX'),
        FATHERMOBILENUMBER: formData.get('FATHERMOBILENUMBER'),
        FATHEREMAIL: formData.get('FATHEREMAIL'),
        MOTHERLASTNAME: formData.get('MOTHERLASTNAME'),
        MOTHERMOBILENUMBER: formData.get('MOTHERMOBILENUMBER'),
        MOTHEREMAIL: formData.get('MOTHEREMAIL'),
        GUARDIANLASTNAME: formData.get('GUARDIANLASTNAME'),
        GUARDIANSUFFIX: formData.get('GUARDIANSUFFIX'),
        GUARDIANMOBILENUMBER: formData.get('GUARDIANMOBILENUMBER'),
        GUARDIANEMAIL: formData.get('GUARDIANEMAIL')
    };
    
       // Set font style and size
       const schoolLogo = '/AsiaSourceiCollege/JS/images/SchoolLogo.png';
       const chedLogo = '/AsiaSourceiCollege/ JS/images/ChedLogo.png';
       
       // Add logos to the header
       const schoolLogoWidth = 30; // Width for school logo
       const schoolLogoHeight = 30; // Height for school logo
       const chedLogoWidth = 22; // Width for CHED logo
       const chedLogoHeight = 22; // Height for CHED logo

       // Add logos to the header
try {
    doc.addImage(schoolLogo, 'PNG', 10, 8, schoolLogoWidth, schoolLogoHeight);
} catch (error) {
    console.error('Error loading School Logo:', error);
}

try {
    doc.addImage(chedLogo, 'PNG', 175, 10, chedLogoWidth, chedLogoHeight); // Adjusted x position
} catch (error) {
    console.error('Error loading CHED Logo:', error);
}



// Title
doc.setFontSize(16);
doc.text('Asia Source iCollege', 105, 20, { align: 'center' }); // Adjusted y position
doc.text('Enrollment Receipt', 105, 30, { align: 'center' }); // Adjusted y position

// Decorative line
const lineY = 38; // Y position for the line
doc.setLineWidth(0.3); // Thinner line
doc.setDrawColor(0, 0, 0); // Black line
doc.line(10, lineY, 200, lineY); // Continuous black line


// Student Information
doc.setFontSize(16);
let yPosition = 50; // Start position for Student Information
doc.text('Student Information', 10, yPosition);
doc.setFontSize(12);

// Spacing and lines for Student Information
const spacing = 6.8; // Reduced spacing
yPosition += 10; // Move down after the section title

doc.text(`Last Name: ${data.LASTNAME || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`First Name: ${data.FIRSTNAME || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Middle Initial: ${data.MIDDLEINITIAL || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Suffix: ${data.SUFFIX || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Sex: ${data.SEX || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Birthdate: ${data.BIRTHDATE || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Age: ${data.AGE || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Religion: ${data.RELIGION || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Mobile Number: ${data.MOBILENUMBER || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Email: ${data.STUDENTEMAILADDRESS || ''}`, 10, yPosition);
yPosition += 0; // Add space

// Line after Student Information
doc.line(10, yPosition + 5, 200, yPosition + 5); // Line after section
yPosition += 10; // Move down for the next section

yPosition += 5;
// Application Information
doc.setFontSize(16);
doc.text('Application Information', 10, yPosition);
doc.setFontSize(12);

// Spacing and lines for Application Information
yPosition += 10; // Adjust yPosition for the content
doc.text(`Grade Level: ${data.GRADELEVEL || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`LRN: ${data.LRN || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Junior High School: ${data.JUNIORHIGHSCHOOL || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`High School Address: ${data.HIGHSCHOOLADDRESS || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Preferred Track: ${data.PREFERREDTRACK || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Preferred Strand: ${data.PREFERREDSTRAND || ''}`, 10, yPosition);
yPosition += 0; // Add space

// Line after Application Information
doc.line(10, yPosition + 5, 200, yPosition + 5); // Line after section
yPosition += 10; // Move down for the next section

yPosition += 5;
// Complete Address
doc.setFontSize(16);
doc.text('Complete Address', 10, yPosition);
doc.setFontSize(12);

// Spacing and lines for Complete Address
yPosition += 10; // Adjust yPosition for the content
doc.text(`Region: ${data.REGION || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Province: ${data.PROVINCE || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`City: ${data.CITY || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Barangay: ${data.BARANGAY || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`House No./Street/Purok: ${data.HOUSENO || ''}`, 10, yPosition);
yPosition += 0; // Add space

// Line after Complete Address
doc.line(10, yPosition + 5, 200, yPosition + 5); // Line after section
yPosition += 10; // Move down for the next section
yPosition += 5;
// Parent Information
doc.setFontSize(14);
doc.text('Parent Information', 10, yPosition );
doc.setFontSize(12);

// Spacing and lines for Parent Information
yPosition += 10; // Adjust yPosition for the content
doc.text(`Father's Full Name: ${data.FATHERLASTNAME || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Father's Suffix: ${data.FATHERSUFFIX || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Father's Mobile Number: ${data.FATHERMOBILENUMBER || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Father's Email: ${data.FATHEREMAIL || ''}`, 10, yPosition);
yPosition += spacing; // Add space

doc.text(`Mother's Full Name: ${data.MOTHERLASTNAME || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Mother's Mobile Number: ${data.MOTHERMOBILENUMBER || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Mother's Email: ${data.MOTHEREMAIL || ''}`, 10, yPosition);
yPosition += spacing; // Add space

doc.text(`Guardian's Full Name: ${data.GUARDIANLASTNAME || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Guardian's Suffix: ${data.GUARDIANSUFFIX || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Guardian's Mobile Number: ${data.GUARDIANMOBILENUMBER || ''}`, 10, yPosition);
yPosition += spacing; // Add space
doc.text(`Guardian's Email: ${data.GUARDIANEMAIL || ''}`, 10, yPosition);
yPosition += spacing; // Add space

const pageHeight = doc.internal.pageSize.height; // Get the height of the page
const bottomMargin = 2; // Set a margin from the bottom
const acknowledgmentY = pageHeight - bottomMargin; // Y position for acknowledgment statement
const dateY = acknowledgmentY - 0; // Y position for date (just above acknowledgment)

// Set smaller font size for acknowledgment and date
doc.setFontSize(10); // Smaller font size
doc.text(`Date: ${new Date().toLocaleDateString()}`, 170, dateY); // Right-aligned
doc.text('This document serves as proof of enrollment and is valid for official purposes.', 10, acknowledgmentY); // Left-aligned

// Save the PDF
doc.save('enrollment_receipt.pdf');
}

function resetToFirstStep() {
console.log('Resetting to first step');
showStep(0); // Show the first step
window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
}

    // Custom alert handling
    function showCustomAlert() {
        console.log('Showing custom alert');
        customAlert.classList.add('show-alert');
    }

    function closeCustomAlert() {
        console.log('Closing custom alert');
        customAlert.classList.remove('show-alert');
    }

    document.getElementById('okButton').addEventListener('click', function () {
        console.log('OK button clicked');
    
        if (isValidationError) {
            // If it's a validation error, just close the alert
            closeCustomAlert();
        } else {
            document.getElementById('admissionForm').reset();
            closeCustomAlert(); // Close the alert
        }
    });


});
