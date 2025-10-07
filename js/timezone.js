// === TIMEZONE & TIMESLOTS ===

function initTimezone() {
    try {
        detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        document.getElementById('timezoneDisplay').innerHTML = `
            <strong>Detected:</strong> ${detectedTimezone}<br>
            <small>This looks correct? If not, use the dropdown below to override.</small>
        `;
        populateTimezones();
        displayTimeslots();
    } catch (error) {
        document.getElementById('timezoneDisplay').innerHTML = 
            '<strong>Error:</strong> Could not detect timezone. Please select manually below.';
        populateTimezones();
    }
}

function populateTimezones() {
    const select = document.getElementById('timezoneOverride');
    const searchInput = document.getElementById('timezoneSearch');
    
    const allTimezones = ['Africa/Abidjan','Africa/Accra','Africa/Addis_Ababa','Africa/Algiers','Africa/Asmara','Africa/Bamako','Africa/Bangui','Africa/Banjul','Africa/Bissau','Africa/Blantyre','Africa/Brazzaville','Africa/Bujumbura','Africa/Cairo','Africa/Casablanca','Africa/Ceuta','Africa/Conakry','Africa/Dakar','Africa/Dar_es_Salaam','Africa/Djibouti','Africa/Douala','Africa/El_Aaiun','Africa/Freetown','Africa/Gaborone','Africa/Harare','Africa/Johannesburg','Africa/Juba','Africa/Kampala','Africa/Khartoum','Africa/Kigali','Africa/Kinshasa','Africa/Lagos','Africa/Libreville','Africa/Lome','Africa/Luanda','Africa/Lubumbashi','Africa/Lusaka','Africa/Malabo','Africa/Maputo','Africa/Maseru','Africa/Mbabane','Africa/Mogadishu','Africa/Monrovia','Africa/Nairobi','Africa/Ndjamena','Africa/Niamey','Africa/Nouakchott','Africa/Ouagadougou','Africa/Porto-Novo','Africa/Sao_Tome','Africa/Tripoli','Africa/Tunis','Africa/Windhoek','America/Adak','America/Anchorage','America/Anguilla','America/Antigua','America/Araguaina','America/Argentina/Buenos_Aires','America/Argentina/Catamarca','America/Argentina/Cordoba','America/Argentina/Jujuy','America/Argentina/La_Rioja','America/Argentina/Mendoza','America/Argentina/Rio_Gallegos','America/Argentina/Salta','America/Argentina/San_Juan','America/Argentina/San_Luis','America/Argentina/Tucuman','America/Argentina/Ushuaia','America/Aruba','America/Asuncion','America/Atikokan','America/Bahia','America/Bahia_Banderas','America/Barbados','America/Belem','America/Belize','America/Blanc-Sablon','America/Boa_Vista','America/Bogota','America/Boise','America/Cambridge_Bay','America/Campo_Grande','America/Cancun','America/Caracas','America/Cayenne','America/Cayman','America/Chicago','America/Chihuahua','America/Costa_Rica','America/Creston','America/Cuiaba','America/Curacao','America/Danmarkshavn','America/Dawson','America/Dawson_Creek','America/Denver','America/Detroit','America/Dominica','America/Edmonton','America/Eirunepe','America/El_Salvador','America/Fort_Nelson','America/Fortaleza','America/Glace_Bay','America/Godthab','America/Goose_Bay','America/Grand_Turk','America/Grenada','America/Guadeloupe','America/Guatemala','America/Guayaquil','America/Guyana','America/Halifax','America/Havana','America/Hermosillo','America/Indiana/Indianapolis','America/Indiana/Knox','America/Indiana/Marengo','America/Indiana/Petersburg','America/Indiana/Tell_City','America/Indiana/Vevay','America/Indiana/Vincennes','America/Indiana/Winamac','America/Inuvik','America/Iqaluit','America/Jamaica','America/Juneau','America/Kentucky/Louisville','America/Kentucky/Monticello','America/Kralendijk','America/La_Paz','America/Lima','America/Los_Angeles','America/Lower_Princes','America/Maceio','America/Managua','America/Manaus','America/Marigot','America/Martinique','America/Matamoros','America/Mazatlan','America/Menominee','America/Merida','America/Metlakatla','America/Mexico_City','America/Miquelon','America/Moncton','America/Monterrey','America/Montevideo','America/Montserrat','America/Nassau','America/New_York','America/Nipigon','America/Nome','America/Noronha','America/North_Dakota/Beulah','America/North_Dakota/Center','America/North_Dakota/New_Salem','America/Ojinaga','America/Panama','America/Pangnirtung','America/Paramaribo','America/Phoenix','America/Port-au-Prince','America/Port_of_Spain','America/Porto_Velho','America/Puerto_Rico','America/Punta_Arenas','America/Rainy_River','America/Rankin_Inlet','America/Recife','America/Regina','America/Resolute','America/Rio_Branco','America/Santarem','America/Santiago','America/Santo_Domingo','America/Sao_Paulo','America/Scoresbysund','America/Sitka','America/St_Barthelemy','America/St_Johns','America/St_Kitts','America/St_Lucia','America/St_Thomas','America/St_Vincent','America/Swift_Current','America/Tegucigalpa','America/Thule','America/Thunder_Bay','America/Tijuana','America/Toronto','America/Tortola','America/Vancouver','America/Whitehorse','America/Winnipeg','America/Yakutat','America/Yellowknife','Antarctica/Casey','Antarctica/Davis','Antarctica/DumontDUrville','Antarctica/Macquarie','Antarctica/Mawson','Antarctica/McMurdo','Antarctica/Palmer','Antarctica/Rothera','Antarctica/Syowa','Antarctica/Troll','Antarctica/Vostok','Arctic/Longyearbyen','Asia/Aden','Asia/Almaty','Asia/Amman','Asia/Anadyr','Asia/Aqtau','Asia/Aqtobe','Asia/Ashgabat','Asia/Atyrau','Asia/Baghdad','Asia/Bahrain','Asia/Baku','Asia/Bangkok','Asia/Barnaul','Asia/Beirut','Asia/Bishkek','Asia/Brunei','Asia/Chita','Asia/Choibalsan','Asia/Colombo','Asia/Damascus','Asia/Dhaka','Asia/Dili','Asia/Dubai','Asia/Dushanbe','Asia/Famagusta','Asia/Gaza','Asia/Hebron','Asia/Ho_Chi_Minh','Asia/Hong_Kong','Asia/Hovd','Asia/Irkutsk','Asia/Jakarta','Asia/Jayapura','Asia/Jerusalem','Asia/Kabul','Asia/Kamchatka','Asia/Karachi','Asia/Kathmandu','Asia/Khandyga','Asia/Kolkata','Asia/Krasnoyarsk','Asia/Kuala_Lumpur','Asia/Kuching','Asia/Kuwait','Asia/Macau','Asia/Magadan','Asia/Makassar','Asia/Manila','Asia/Muscat','Asia/Nicosia','Asia/Novokuznetsk','Asia/Novosibirsk','Asia/Omsk','Asia/Oral','Asia/Phnom_Penh','Asia/Pontianak','Asia/Pyongyang','Asia/Qatar','Asia/Qostanay','Asia/Qyzylorda','Asia/Riyadh','Asia/Sakhalin','Asia/Samarkand','Asia/Seoul','Asia/Shanghai','Asia/Singapore','Asia/Srednekolymsk','Asia/Taipei','Asia/Tashkent','Asia/Tbilisi','Asia/Tehran','Asia/Thimphu','Asia/Tokyo','Asia/Tomsk','Asia/Ulaanbaatar','Asia/Urumqi','Asia/Ust-Nera','Asia/Vientiane','Asia/Vladivostok','Asia/Yakutsk','Asia/Yangon','Asia/Yekaterinburg','Asia/Yerevan','Atlantic/Azores','Atlantic/Bermuda','Atlantic/Canary','Atlantic/Cape_Verde','Atlantic/Faroe','Atlantic/Madeira','Atlantic/Reykjavik','Atlantic/South_Georgia','Atlantic/St_Helena','Atlantic/Stanley','Australia/Adelaide','Australia/Brisbane','Australia/Broken_Hill','Australia/Currie','Australia/Darwin','Australia/Eucla','Australia/Hobart','Australia/Lindeman','Australia/Lord_Howe','Australia/Melbourne','Australia/Perth','Australia/Sydney','Europe/Amsterdam','Europe/Andorra','Europe/Astrakhan','Europe/Athens','Europe/Belgrade','Europe/Berlin','Europe/Bratislava','Europe/Brussels','Europe/Bucharest','Europe/Budapest','Europe/Busingen','Europe/Chisinau','Europe/Copenhagen','Europe/Dublin','Europe/Gibraltar','Europe/Guernsey','Europe/Helsinki','Europe/Isle_of_Man','Europe/Istanbul','Europe/Jersey','Europe/Kaliningrad','Europe/Kiev','Europe/Kirov','Europe/Lisbon','Europe/Ljubljana','Europe/London','Europe/Luxembourg','Europe/Madrid','Europe/Malta','Europe/Mariehamn','Europe/Minsk','Europe/Monaco','Europe/Moscow','Europe/Oslo','Europe/Paris','Europe/Podgorica','Europe/Prague','Europe/Riga','Europe/Rome','Europe/Samara','Europe/San_Marino','Europe/Sarajevo','Europe/Saratov','Europe/Simferopol','Europe/Skopje','Europe/Sofia','Europe/Stockholm','Europe/Tallinn','Europe/Tirane','Europe/Ulyanovsk','Europe/Uzhgorod','Europe/Vaduz','Europe/Vatican','Europe/Vienna','Europe/Vilnius','Europe/Volgograd','Europe/Warsaw','Europe/Zagreb','Europe/Zaporozhye','Europe/Zurich','Indian/Antananarivo','Indian/Chagos','Indian/Christmas','Indian/Cocos','Indian/Comoro','Indian/Kerguelen','Indian/Mahe','Indian/Maldives','Indian/Mauritius','Indian/Mayotte','Indian/Reunion','Pacific/Apia','Pacific/Auckland','Pacific/Bougainville','Pacific/Chatham','Pacific/Chuuk','Pacific/Easter','Pacific/Efate','Pacific/Enderbury','Pacific/Fakaofo','Pacific/Fiji','Pacific/Funafuti','Pacific/Galapagos','Pacific/Gambier','Pacific/Guadalcanal','Pacific/Guam','Pacific/Honolulu','Pacific/Kiritimati','Pacific/Kosrae','Pacific/Kwajalein','Pacific/Majuro','Pacific/Marquesas','Pacific/Midway','Pacific/Nauru','Pacific/Niue','Pacific/Norfolk','Pacific/Noumea','Pacific/Pago_Pago','Pacific/Palau','Pacific/Pitcairn','Pacific/Pohnpei','Pacific/Port_Moresby','Pacific/Rarotonga','Pacific/Saipan','Pacific/Tahiti','Pacific/Tarawa','Pacific/Tongatapu','Pacific/Wake','Pacific/Wallis'];
    
    allTimezones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz;
        option.textContent = tz.replace('_', ' ');
        select.appendChild(option);
    });
    
    let allOptions = [...select.options];
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        select.innerHTML = '<option value="">Use detected timezone</option>';
        
        if (!searchTerm.trim()) {
            allOptions.slice(1).forEach(opt => select.appendChild(opt.cloneNode(true)));
        } else if (searchTerm.startsWith('utc')) {
            const offset = searchTerm.replace('utc', '').trim();
            if (offset) {
                const option = document.createElement('option');
                option.value = `UTC${offset}`;
                option.textContent = `UTC${offset}`;
                select.appendChild(option);
            }
            allOptions.slice(1).forEach(opt => {
                if (opt.textContent.toLowerCase().includes(searchTerm)) {
                    select.appendChild(opt.cloneNode(true));
                }
            });
        } else {
            allOptions.slice(1).forEach(opt => {
                if (opt.textContent.toLowerCase().includes(searchTerm)) {
                    select.appendChild(opt.cloneNode(true));
                }
            });
        }
    });
    
    select.addEventListener('change', displayTimeslots);
}

function displayTimeslots() {
    const container = document.getElementById('timeslotGrid');
    const selectedTimezone = document.getElementById('timezoneOverride').value || detectedTimezone;
    
    if (!selectedTimezone) {
        container.innerHTML = '<div class="note">Please detect or select a timezone first.</div>';
        return;
    }
    
    container.innerHTML = '';
    
    sessionTimesEST.forEach((session, index) => {
        const today = new Date();
        const sessionDate = new Date(today);
        
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const targetDay = days.indexOf(session.day);
        const currentDay = today.getDay();
        const daysUntil = (targetDay + 7 - currentDay) % 7 || 7;
        
        sessionDate.setDate(today.getDate() + daysUntil);
        const [hours, minutes] = session.time.split(':');
        const estHours = parseInt(hours);
        sessionDate.setUTCHours(estHours + 5, parseInt(minutes), 0, 0);
        
        const localTime = sessionDate.toLocaleString('en-US', {
            timeZone: selectedTimezone,
            weekday: 'long',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        const timeslotDiv = document.createElement('div');
        timeslotDiv.className = 'timeslot-item';
        timeslotDiv.innerHTML = `
            <div class="timeslot-time">${localTime}</div>
            <div class="timeslot-options">
                <label data-value="preferred">
                    <input type="radio" name="timeslot_${index}" value="preferred" required>
                    Preferred
                </label>
                <label data-value="possible">
                    <input type="radio" name="timeslot_${index}" value="possible" required>
                    Possible
                </label>
                <label data-value="unavailable" class="selected">
                    <input type="radio" name="timeslot_${index}" value="unavailable" required checked>
                    Unavailable
                </label>
            </div>
            <div class="timeslot-flexibility">
                <div class="flexibility-label">Time Flexibility:</div>
                <div class="flexibility-options">
                    <label data-value="possible_earlier">
                        <input type="radio" name="timeslot_${index}" value="possible_earlier">
                        Possible (An Hour Earlier)
                        <span class="tooltip">This time isn't ideal, but I'm open to a slight adjustment if it works better for the group.</span>
                    </label>
                    <label data-value="possible_later">
                        <input type="radio" name="timeslot_${index}" value="possible_later">
                        Possible (An Hour Later)
                        <span class="tooltip">This time isn't ideal, but I'm open to a slight adjustment if it works better for the group.</span>
                    </label>
                </div>
            </div>
        `;
        
        timeslotDiv.querySelectorAll('label[data-value]').forEach(label => {
            label.addEventListener('click', function(e) {
                e.preventDefault();
                const radio = this.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change'));
                    timeslotDiv.querySelectorAll('label[data-value]').forEach(l => l.classList.remove('selected'));
                    this.classList.add('selected');
                    saveFormData();
                }
                return false;
            });
        });
        
        container.appendChild(timeslotDiv);
    });
    
    // Restore saved selections
    setTimeout(() => {
        try {
            const savedData = localStorage.getItem('dnd_form_data');
            if (savedData) {
                const formData = JSON.parse(savedData);
                Object.keys(formData).forEach(name => {
                    if (name.startsWith('timeslot_')) {
                        const radio = document.querySelector(`input[name="${name}"][value="${formData[name]}"]`);
                        if (radio) {
                            radio.checked = true;
                            const timeslotDiv = radio.closest('.timeslot-item');
                            timeslotDiv.querySelectorAll('label[data-value]').forEach(l => l.classList.remove('selected'));
                            const selectedLabel = radio.closest('label[data-value]');
                            if (selectedLabel) selectedLabel.classList.add('selected');
                        }
                    }
                });
            }
        } catch (e) {
            console.warn('Could not restore timeslot selections:', e);
        }
    }, 50);
}