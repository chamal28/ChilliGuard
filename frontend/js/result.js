document.addEventListener('DOMContentLoaded', function () {
    // Check the user session
    const token = localStorage.getItem('authToken') ||
        sessionStorage.getItem('authToken');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const resultString = sessionStorage.getItem('predictionResult');
    const validationString = sessionStorage.getItem('predictionValidation');

    if (!resultString) {
        alert('No prediction result found. Please upload an image first.');
        window.location.href = 'detect.html';
        return;
    }

    let resultData;
    let validationData;

    try {
        resultData = JSON.parse(resultString);
        validationData = validationString ? JSON.parse(validationString) : null;
    } catch (error) {
        console.error('Invalid prediction data:', error);
        alert('Unable to read the prediction result.');
        window.location.href = 'detect.html';
        return;
    }

    const validationText = document.getElementById('validationText');
    const resultStatus = document.getElementById('resultStatus');
    const resultMessage = document.getElementById('resultMessage');
    const diseaseCount = document.getElementById('diseaseCount');
    const diseaseResults = document.getElementById('diseaseResults');

    const warningBox = document.getElementById('predictionWarning');
    const warningText = document.getElementById('warningText');

    const severitySection = document.getElementById('severitySection');
    const severityStage = document.getElementById('severityStage');
    const severityConfidence = document.getElementById('severityConfidence');
    const severityFill = document.getElementById('severityFill');
    const severityDescription = document.getElementById('severityDescription');
    const severityDiseaseLabel = document.getElementById('severityDiseaseLabel');

    const diseases = Array.isArray(resultData.detected_diseases)
        ? resultData.detected_diseases
        : [];

    const uncertain = resultData.uncertain_candidate || null;
    const severity = resultData.severity || null;

    // English and Sinhala translations
    const translations = {
        en: {
            dashboard: 'Dashboard',
            detect: 'Detect',
            history: 'History',
            result: 'Prediction Result',
            logout: 'Logout',
            pageLabel: 'AI Leaf Analysis',
            pageTitle: 'Prediction Result',
            pageSubtitle: 'Chilli leaf disease detection and severity analysis',
            imageValidation: 'Image Validation',
            validImage: 'Valid chilli leaf image. Validation score:',
            validationUnavailable: 'Image validation details are not available.',
            analysisCompleted: 'Analysis Completed',
            detectedMessage: 'Conditions identified by the model.',
            uncertainPrediction: 'Uncertain Prediction',
            noClassPassed: 'No class passed its threshold.',
            detectedConditions: 'Detected Conditions',
            detectedSubtitle: 'Conditions meeting their individual classification thresholds',
            modelScore: 'Model Score',
            primaryRank: 'Highest confidence',
            secondaryRank: 'Second highest',
            otherRank: 'Detected condition',
            detectionThreshold: 'Detection threshold:',
            canControl: 'Can it be controlled?',
            informationUnavailable: 'Information unavailable',
            recommendedAction: 'Recommended Action',
            preventionMethods: 'Prevention Methods',
            estimatedStage: 'Estimated Stage',
            stageScore: 'Stage Score',
            infectionStage: 'Severity of Highest-Confidence Condition',
            severityScopeNote: 'The severity model estimates the uploaded leaf image overall. This stage is displayed alongside the highest-confidence condition; it is not a separate severity score for each disease.',
            early: 'Early',
            advanced: 'Advanced',
            advancedDescription: 'The severity model estimates an advanced infection stage. This is a two-class prediction, not a measurement of the infected leaf area.',
            earlyDescription: 'The severity model estimates an early infection stage. Continue monitoring and seek agricultural advice when needed.',
            severityUnavailable: 'Severity assessment is not available for this condition.',
            multipleWarning: 'Multiple conditions passed their classification thresholds. This does not confirm that all conditions are present. Please consult an agricultural expert.',
            possibleCondition: 'Possible Condition (Uncertain)',
            modelCouldNotIdentify: 'The model could not identify a condition above its threshold. Please try another clear image or consult an agricultural expert.',
            noReliableClassification: 'No reliable disease classification is available.',
            classes: 'Classes',
            class: 'Class',
            advice: 'AI predictions are decision-support information, not a confirmed agricultural diagnosis. Consult a qualified agricultural officer before applying pesticides or removing large numbers of plants.',
            newDetection: 'New Detection',
            viewHistory: 'View History'
        },

        si: {
            dashboard: 'පාලක පුවරුව',
            detect: 'රෝග හඳුනාගැනීම',
            history: 'පෙර වාර්තා',
            result: 'අනාවැකි ප්‍රතිඵල',
            logout: 'ඉවත් වන්න',
            pageLabel: 'AI පත්‍ර විශ්ලේෂණය',
            pageTitle: 'අනාවැකි ප්‍රතිඵලය',
            pageSubtitle: 'මිරිස් පත්‍ර රෝග හඳුනාගැනීම සහ රෝග තත්ත්වය විශ්ලේෂණය',
            imageValidation: 'රූපය පරීක්ෂා කිරීම',
            validImage: 'වලංගු මිරිස් පත්‍ර රූපයකි. පරීක්ෂණ ලකුණු:',
            validationUnavailable: 'රූප පරීක්ෂණ විස්තර ලබාගත නොහැක.',
            analysisCompleted: 'විශ්ලේෂණය සම්පූර්ණයි',
            detectedMessage: 'ආකෘතිය මඟින් හඳුනාගත් තත්ත්වයන්.',
            uncertainPrediction: 'නිශ්චිත නොවන අනාවැකියක්',
            noClassPassed: 'කිසිදු රෝග කාණ්ඩයක් නියමිත සීමාව ඉක්මවා නැත.',
            detectedConditions: 'හඳුනාගත් තත්ත්වයන්',
            detectedSubtitle: 'එක් එක් වර්ගීකරණ සීමාව සපුරාලූ තත්ත්වයන්',
            modelScore: 'ආකෘතියේ ලකුණු',
            primaryRank: 'ඉහළම විශ්වාස ලකුණ',
            secondaryRank: 'දෙවන ඉහළම ලකුණ',
            otherRank: 'හඳුනාගත් තත්ත්වය',
            detectionThreshold: 'හඳුනාගැනීමේ සීමාව:',
            canControl: 'මෙය පාලනය කළ හැකිද?',
            informationUnavailable: 'තොරතුරු ලබාගත නොහැක',
            recommendedAction: 'නිර්දේශිත ක්‍රියාමාර්ග',
            preventionMethods: 'වැළැක්වීමේ ක්‍රම',
            estimatedStage: 'අනුමාන කළ අවධිය',
            stageScore: 'අවධි ලකුණු',
            infectionStage: 'ඉහළම විශ්වාස ලකුණ ඇති රෝගයේ තත්ත්වය',
            severityScopeNote: 'රෝග අවධි ආකෘතිය මඟින් upload කළ පත්‍ර රූපයේ සමස්ත අවධිය අනුමාන කරයි. එය ඉහළම විශ්වාස ලකුණ ඇති රෝගය සමඟ පෙන්වුවද, එක් එක් රෝගය සඳහා වෙනම ගණනය කළ අවධියක් නොවේ.',
            early: 'මුල් අවධිය',
            advanced: 'උසස් අවධිය',
            advancedDescription: 'රෝග අවධි ආකෘතිය මඟින් උසස් ආසාදන අවධියක් අනුමාන කරයි. මෙය අවධි දෙකක අනාවැකියක් වන අතර ආසාදිත පත්‍ර ප්‍රමාණය මැනීමක් නොවේ.',
            earlyDescription: 'රෝග අවධි ආකෘතිය මඟින් මුල් ආසාදන අවධියක් අනුමාන කරයි. දිගටම නිරීක්ෂණය කර අවශ්‍ය විට කෘෂිකර්ම උපදෙස් ලබාගන්න.',
            severityUnavailable: 'මෙම තත්ත්වය සඳහා රෝග අවධිය තක්සේරු කිරීම ලබාගත නොහැක.',
            multipleWarning: 'තත්ත්ව කිහිපයක් ඒවාට අදාළ වර්ගීකරණ සීමා සපුරාලා ඇත. එයින් සියලුම තත්ත්වයන් සැබවින්ම පවතින බව තහවුරු නොවේ. කෘෂිකර්ම විශේෂඥයෙකුගෙන් උපදෙස් ලබාගන්න.',
            possibleCondition: 'විය හැකි තත්ත්වය (නිශ්චිත නොවේ)',
            modelCouldNotIdentify: 'නියමිත සීමාව ඉක්මවන තත්ත්වයක් ආකෘතියට හඳුනාගත නොහැකි විය. තවත් පැහැදිලි රූපයක් උත්සාහ කරන්න, නැතහොත් කෘෂිකර්ම විශේෂඥයෙකුගෙන් උපදෙස් ලබාගන්න.',
            noReliableClassification: 'විශ්වාසදායක රෝග වර්ගීකරණයක් ලබාගත නොහැක.',
            classes: 'වර්ග',
            class: 'වර්ගය',
            advice: 'AI අනාවැකි තීරණ ගැනීමට සහාය වන තොරතුරු පමණි. ඒවා තහවුරු කළ කෘෂිකාර්මික රෝග විනිශ්චයක් නොවේ. කෘමිනාශක භාවිතයට හෝ පැළ විශාල ප්‍රමාණයක් ඉවත් කිරීමට පෙර සුදුසුකම් ලත් කෘෂිකර්ම නිලධාරියෙකුගෙන් උපදෙස් ලබාගන්න.',
            newDetection: 'නව පරීක්ෂාවක්',
            viewHistory: 'පෙර වාර්තා බලන්න'
        }
    };

    let currentLanguage = localStorage.getItem('chilliguardLanguage') || 'en';

    if (!translations[currentLanguage]) {
        currentLanguage = 'en';
    }

    function t(key) {
        return translations[currentLanguage][key] ||
            translations.en[key] || '';
    }

    function getDiseaseName(disease) {
        if (currentLanguage === 'si') {
            return disease.disease_name_si ||
                disease.disease_name ||
                disease.class_name;
        }

        return disease.disease_name || disease.class_name;
    }

    function getDiseaseField(disease, englishField, sinhalaField) {
        const value = currentLanguage === 'si'
            ? disease[sinhalaField]
            : disease[englishField];

        return value ||
            disease[englishField] ||
            t('informationUnavailable');
    }

    // Add the language selector to the navigation bar
    function createLanguageSelector() {
        const navList = document.querySelector('#dashNav .navbar-nav');

        if (!navList || document.getElementById('languageSelectorItem')) {
            return;
        }

        const item = document.createElement('li');
        item.className = 'nav-item sidebar-language-item';
        item.id = 'languageSelectorItem';

        const label = document.createElement('label');
        label.className = 'visually-hidden';
        label.htmlFor = 'languageSelect';
        label.textContent = 'Language';

        const select = document.createElement('select');
        select.id = 'languageSelect';
        select.className = 'form-select form-select-sm';
        select.setAttribute('aria-label', 'Select language');

        [
            { value: 'en', text: 'English' },
            { value: 'si', text: 'සිංහල' }
        ].forEach(function (optionData) {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.textContent = optionData.text;
            select.appendChild(option);
        });

        select.value = currentLanguage;

        select.addEventListener('change', function () {
            currentLanguage = select.value;
            localStorage.setItem('chilliguardLanguage', currentLanguage);
            renderPage();
        });

        item.appendChild(label);
        item.appendChild(select);

        const logoutItem = navList.querySelector('#logoutBtn')?.closest('li');

        if (logoutItem) {
            navList.insertBefore(item, logoutItem);
        } else {
            navList.appendChild(item);
        }
    }

    function setText(selector, value) {
        const element = document.querySelector(selector);

        if (!element) return;

        const icon = element.querySelector(':scope > i');

        element.textContent = '';

        if (icon) {
            element.appendChild(icon);
            element.appendChild(document.createTextNode(' ' + value));
        } else {
            element.textContent = value;
        }
    }

    // Update the fixed page labels

    function updateStaticLabels() {
        setText('.sidebar-link[data-nav-key="dashboard"] span', t('dashboard'));
        setText('.sidebar-link[data-nav-key="detect"] span', t('detect'));
        setText('.sidebar-link[data-nav-key="history"] span', t('history'));
        setText('.sidebar-link[data-nav-key="result"] span', t('result'));

        const logoutButton = document.getElementById('logoutBtn');

        if (logoutButton) {
            const icon = logoutButton.querySelector('i');
            logoutButton.innerHTML = '';

            if (icon) logoutButton.appendChild(icon);

            const span = document.createElement('span');
            span.textContent = t('logout');
            logoutButton.appendChild(span);
        }

        setText('.result-label', t('pageLabel'));
        setText('.page-intro h2', t('pageTitle'));
        setText('.page-intro p.text-muted', t('pageSubtitle'));
        setText('.validation-box h6', t('imageValidation'));
        setText('.section-heading h4', t('detectedConditions'));
        setText('.section-heading p', t('detectedSubtitle'));
        setText('#severitySection .section-heading h4', t('infectionStage'));
        setText('#severityDescription', t('severityScopeNote'));
        setText('.severity-top .text-muted', t('estimatedStage'));
        setText('.advice-notice span', t('advice'));
        setText('#newDetection', t('newDetection'));

        const historyLink = document.querySelector(
            'a[href="history.html"].btn'
        );

        if (historyLink) {
            historyLink.innerHTML =
                '<i class="fas fa-history me-2"></i>' + t('viewHistory');
        }

        const dashboardLink = document.querySelector(
            'a[href="dashboard.html"].btn'
        );

        if (dashboardLink) {
            dashboardLink.innerHTML =
                '<i class="fas fa-th-large me-2"></i>' + t('dashboard');
        }

        const selector = document.getElementById('languageSelect');

        if (selector) {
            selector.value = currentLanguage;
        }
    }


    // Show a prediction warning
    function showWarning(message) {
        warningText.textContent = message;
        warningBox.classList.remove('d-none');
    }

    // Create an HTML element with text
    function createTextElement(tagName, className, text) {
        const element = document.createElement(tagName);

        element.className = className;
        element.textContent = text;

        return element;
    }

    // Convert recommendation paragraphs into readable bullet points.
    function createAdviceList(text) {
        const list = document.createElement('ul');
        list.className = 'advice-list';

        const points = String(text || '')
            .split(/\r?\n|\s*;\s*|(?<=[.!?।])\s+(?=[A-Z0-9\u0D80-\u0DFF])/)
            .map(point => point.replace(/^\\s*[-•*]+\\s*/, '').trim())
            .filter(Boolean);

        points.forEach(function (point) {
            const item = document.createElement('li');
            item.textContent = point;
            list.appendChild(item);
        });

        if (!points.length) {
            const item = document.createElement('li');
            item.textContent = t('informationUnavailable');
            list.appendChild(item);
        }

        return list;
    }

    // Create a disease result card
    function createDiseaseCard(disease, rank) {
        const column = document.createElement('div');

        column.className = rank === 0
            ? 'col-12 primary-disease-column'
            : 'col-md-6 other-disease-column';

        const card = document.createElement('div');
        card.className = 'disease-card ' +
            (rank === 0 ? 'primary-disease' : rank === 1 ? 'secondary-disease' : 'other-disease');

        const rankHeader = document.createElement('div');
        rankHeader.className = 'disease-rank-header';
        rankHeader.appendChild(createTextElement(
            'span',
            'disease-rank-badge',
            rank === 0 ? t('primaryRank') : rank === 1 ? t('secondaryRank') : t('otherRank')
        ));

        if (rank === 0) {
            rankHeader.appendChild(createTextElement('span', 'top-disease-mark', 'TOP'));
        }

        card.appendChild(rankHeader);

        card.appendChild(
            createTextElement(
                'h5',
                'disease-name',
                getDiseaseName(disease)
            )
        );

        card.appendChild(
            createTextElement(
                'p',
                'disease-class mb-2',
                String(disease.class_name || '').replaceAll('_', ' ')
            )
        );

        const confidenceBox = document.createElement('div');
        confidenceBox.className = 'confidence-box';

        confidenceBox.appendChild(
            createTextElement(
                'span',
                'confidence-label',
                t('modelScore')
            )
        );

        confidenceBox.appendChild(
            createTextElement(
                'span',
                'confidence-score',
                `${disease.confidence_score}%`
            )
        );

        card.appendChild(confidenceBox);

        const progress = document.createElement('div');
        progress.className = 'confidence-progress';

        const progressFill = document.createElement('div');
        progressFill.className = 'confidence-progress-fill';

        const score = Math.max(
            0,
            Math.min(100, Number(disease.confidence_score) || 0)
        );

        progressFill.style.width = `${score}%`;

        const confidenceChart = document.createElement('div');
        confidenceChart.className = 'confidence-donut';
        confidenceChart.style.setProperty('--score', `${score}%`);
        confidenceChart.setAttribute('data-score', `${score.toFixed(1)}%`);

        confidenceChart.setAttribute(
            'aria-label',
            `Model confidence ${score}%`
        );

        confidenceBox.prepend(confidenceChart);


        progress.appendChild(progressFill);
        card.appendChild(progress);

        card.appendChild(
            createTextElement(
                'p',
                'confidence-label mt-2 mb-0',
                `${t('detectionThreshold')} ${(Number(disease.threshold) * 100).toFixed(0)}%`
            )
        );

        const details = document.createElement('div');
        details.className = 'disease-details';

        details.appendChild(
            createTextElement(
                'p',
                'detail-title',
                t('canControl')
            )
        );

        details.appendChild(
            createTextElement(
                'p',
                'detail-text',
                getDiseaseField(
                    disease,
                    'is_curable',
                    'is_curable_si'
                )
            )
        );

        // Treatment information
        const treatmentBox = document.createElement('div');
        treatmentBox.className = 'treatment-box';

        treatmentBox.appendChild(
            createTextElement(
                'p',
                'detail-title',
                t('recommendedAction')
            )
        );

        treatmentBox.appendChild(
            createAdviceList(
                getDiseaseField(
                    disease,
                    'treatment',
                    'treatment_si'
                )
            )
        );

        details.appendChild(treatmentBox);

        // Prevention information
        const preventionBox = document.createElement('div');
        preventionBox.className = 'prevention-box';

        preventionBox.appendChild(
            createTextElement(
                'p',
                'detail-title',
                t('preventionMethods')
            )
        );

        preventionBox.appendChild(
            createAdviceList(
                getDiseaseField(
                    disease,
                    'prevention',
                    'prevention_si'
                )
            )
        );

        details.appendChild(preventionBox);

        // Display severity information when available
        if (disease.severity) {
            const stage = disease.severity.stage === 'Advanced'
                ? t('advanced')
                : t('early');

            details.appendChild(
                createTextElement(
                    'p',
                    'detail-text mt-3 mb-0',
                    `${t('estimatedStage')}: ${stage}`
                )
            );
        } else {
            details.appendChild(
                createTextElement(
                    'p',
                    'detail-text mt-3 mb-0',
                    t('severityUnavailable')
                )
            );
        }

        card.appendChild(details);
        column.appendChild(card);

        return column;
    }

    // Render the prediction result in the selected language
    function renderPage() {
        createLanguageSelector();
        updateStaticLabels();

        // Display image validation result
        if (validationData && validationData.is_valid) {
            validationText.textContent =
                `${t('validImage')} ${validationData.valid_probability}%`;
        } else {
            validationText.textContent = t('validationUnavailable');
        }

        warningBox.classList.add('d-none');
        warningText.textContent = '';
        diseaseResults.innerHTML = '';

        // Display detected diseases
        if (resultData.status === 'detected' && diseases.length > 0) {
            resultStatus.textContent = t('analysisCompleted');

            resultMessage.textContent = currentLanguage === 'si'
                ? (resultData.message_si || resultData.message || t('detectedMessage'))
                : (resultData.message || t('detectedMessage'));

            diseaseCount.textContent =
                `${diseases.length} ${diseases.length === 1 ? t('class') : t('classes')}`;

            const rankedDiseases = [...diseases].sort(function (a, b) {
                return Number(b.confidence_score || 0) - Number(a.confidence_score || 0);
            });

            if (severityDiseaseLabel && rankedDiseases.length) {
                severityDiseaseLabel.textContent = currentLanguage === 'si'
                    ? `ප්‍රධාන හඳුනාගත් රෝගය: ${getDiseaseName(rankedDiseases[0])}`
                    : `Primary detected condition: ${getDiseaseName(rankedDiseases[0])}`;
            }

            rankedDiseases.forEach(function (disease, index) {
                diseaseResults.appendChild(createDiseaseCard(disease, index));
            });

            if (diseases.length > 1) {
                showWarning(t('multipleWarning'));
            }

        } else {
            resultStatus.textContent = t('uncertainPrediction');

            resultMessage.textContent = currentLanguage === 'si'
                ? (resultData.message_si || resultData.message || t('noClassPassed'))
                : (resultData.message || t('noClassPassed'));

            diseaseCount.textContent = `0 ${t('classes')}`;

            if (uncertain) {
                const uncertainColumn = document.createElement('div');
                uncertainColumn.className = 'col-12';

                const uncertainBox = document.createElement('div');
                uncertainBox.className = 'uncertain-result';

                uncertainBox.appendChild(
                    createTextElement(
                        'h5',
                        'fw-bold',
                        t('possibleCondition')
                    )
                );

                uncertainBox.appendChild(
                    createTextElement(
                        'p',
                        'mb-1',
                        getDiseaseName(uncertain)
                    )
                );

                uncertainBox.appendChild(
                    createTextElement(
                        'p',
                        'small text-muted mb-0',
                        `${t('modelScore')}: ${uncertain.confidence_score}%`
                    )
                );

                uncertainColumn.appendChild(uncertainBox);
                diseaseResults.appendChild(uncertainColumn);

            } else {
                diseaseResults.appendChild(
                    createTextElement(
                        'div',
                        'col-12 empty-result',
                        t('noReliableClassification')
                    )
                );
            }

            showWarning(t('modelCouldNotIdentify'));
        }

        // Display severity result
        if (severity && severity.stage) {
            severitySection.classList.remove('d-none');

            severityStage.textContent =
                severity.stage === 'Advanced'
                    ? t('advanced')
                    : t('early');

            severityConfidence.textContent =
                `${severity.confidence_score}% ${t('stageScore')}`;

            severityFill.classList.remove('early', 'advanced');

            if (severity.stage === 'Advanced') {
                severityFill.classList.add('advanced');
                severityFill.style.width = '100%';

                severityDescription.textContent =
                    t('advancedDescription');

            } else {
                severityFill.classList.add('early');
                severityFill.style.width = '50%';

                severityDescription.textContent =
                    t('earlyDescription');
            }

        } else {
            severitySection.classList.add('d-none');
        }

        // Display the recommendation scope note when available
        const scopeNote = currentLanguage === 'si'
            ? resultData.recommendation_scope_note_si
            : resultData.recommendation_scope_note;

        let scopeElement = document.getElementById(
            'recommendationScopeNote'
        );

        if (scopeNote) {
            if (!scopeElement) {
                scopeElement = document.createElement('div');
                scopeElement.id = 'recommendationScopeNote';
                scopeElement.className = 'alert alert-info small mt-3';

                const adviceNotice = document.querySelector('.advice-notice');

                if (adviceNotice) {
                    adviceNotice.insertAdjacentElement(
                        'beforebegin',
                        scopeElement
                    );
                }
            }

            scopeElement.textContent = scopeNote;

        } else if (scopeElement) {
            scopeElement.textContent = '';
        }
    }

    // Log out the current user
    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');

            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('currentUser');

            sessionStorage.removeItem('predictionResult');
            sessionStorage.removeItem('predictionValidation');
            sessionStorage.removeItem('predictionId');

            window.location.href = 'login.html';
        });
    }

    // Display the page
    renderPage();
});
