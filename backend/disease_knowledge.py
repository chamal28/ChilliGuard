
"""
ChilliGuard - Bilingual Disease Knowledge Base
Languages: English and Sinhala

The management recommendations are based on Sri Lankan
Department of Agriculture / HORDI Capsicum guidance.

Important:
The reviewed HORDI Capsicum guidance mainly refers to
Capsicum annuum. It has not been independently validated
for Capsicum frutescens (Nai Miris / Kochchi).
"""

RECOMMENDATION_SCOPE_NOTE = (
    "These recommendations are based on Sri Lankan Department of "
    "Agriculture / HORDI Capsicum guidance, mainly for Capsicum annuum. "
    "They have not been independently validated for Capsicum frutescens "
    "(Nai Miris). Confirm crop-specific advice with a local "
    "Agriculture Instructor."
)

RECOMMENDATION_SCOPE_NOTE_SI = (
    "මෙම නිර්දේශ ශ්‍රී ලංකා කෘෂිකර්ම දෙපාර්තමේන්තුවේ HORDI "
    "Capsicum වගා මාර්ගෝපදේශ මත පදනම් වී ඇත. එම මාර්ගෝපදේශ "
    "ප්‍රධාන වශයෙන් Capsicum annuum සඳහා වන අතර Nai Miris "
    "(Capsicum frutescens) සඳහා වෙනම තහවුරු කර නොමැත. "
    "ප්‍රතිකාර ක්‍රියාත්මක කිරීමට පෙර ප්‍රදේශයේ කෘෂිකර්ම "
    "නිලධාරියෙකුගෙන් උපදෙස් ලබාගන්න."
)


DISEASE_INFO = {

    # 1. Bacterial Leaf Spot
    "Bacterial_Leaf_Spot": {
        "display_name": "Bacterial Leaf Spot",
        "display_name_si": "බැක්ටීරියා කොළ පුල්ලි රෝගය",

        "curable": "Not confirmed",
        "curable_si": "ප්‍රතිකාරය තහවුරු කර නොමැත",

        "action": (
            "A chilli-specific treatment recommendation for this disease "
            "could not be verified from the reviewed Sri Lankan DOA/HORDI "
            "sources. Do not apply pesticides based only on this AI result. "
            "Show the affected plant to a local Agriculture Instructor "
            "for confirmation and suitable advice."
        ),
        "action_si": (
            "මෙම රෝගය සඳහා මිරිස් වගාවට විශේෂිත වූ ප්‍රතිකාරයක් "
            "සමාලෝචනය කළ ශ්‍රී ලංකා කෘෂිකර්ම දෙපාර්තමේන්තු "
            "මූලාශ්‍රවලින් තහවුරු කරගත නොහැකි විය. මෙම AI "
            "ප්‍රතිඵලය පමණක් පදනම් කරගෙන කෘමිනාශක හෝ වෙනත් "
            "රසායනික ද්‍රව්‍ය භාවිත නොකරන්න. රෝග ලක්ෂණ සහිත "
            "පැළ කෘෂිකර්ම නිලධාරියෙකුට පෙන්වා රෝගය තහවුරු "
            "කරගෙන සුදුසු උපදෙස් ලබාගන්න."
        ),

        "prevention": (
            "Monitor plants regularly and maintain good field hygiene. "
            "Avoid making treatment decisions until the suspected disease "
            "has been confirmed by an agricultural officer."
        ),
        "prevention_si": (
            "පැළ නිරන්තරයෙන් පරීක්ෂා කර වගා බිම පිරිසිදුව "
            "පවත්වා ගන්න. සැක සහිත රෝගය කෘෂිකර්ම නිලධාරියෙකු "
            "විසින් තහවුරු කරන තුරු ප්‍රතිකාර තීරණ ගැනීමෙන් වළකින්න."
        ),

        "source": (
            "No specific chilli Bacterial Leaf Spot treatment guidance "
            "verified in the reviewed DOA/HORDI sources."
        ),
        "source_url": "https://doa.gov.lk/hordi-crop-capsicum/"
    },


    # 2. Cercospora Leaf Spot
    "Cercospora_Spot": {
        "display_name": "Cercospora Leaf Spot",
        "display_name_si": "Cercospora පත්‍ර පුල්ලි රෝගය",

        "curable": "Management possible",
        "curable_si": "නිසි කළමනාකරණය මඟින් පාලනය කළ හැකිය",

        "action": (
            "Collect and remove infected leaves from the field. Dispose "
            "of affected plant material appropriately. Maintain suitable "
            "plant spacing and manage irrigation to reduce excessive "
            "humidity around the plants. Seek advice from a local "
            "Agriculture Instructor if the disease continues to spread."
        ),
        "action_si": (
            "රෝගය වැළඳුණු පත්‍ර එකතු කර වගා බිමෙන් ඉවත් කරන්න. "
            "ඉවත් කළ රෝගී ශාක කොටස් නිසි පරිදි බැහැර කරන්න. "
            "පැළ අතර ප්‍රමාණවත් පරතරයක් පවත්වා ගන්න. පැළ "
            "අවට අධික තෙතමනය ඇති නොවන පරිදි ජලය සැපයීම "
            "කළමනාකරණය කරන්න. රෝගය තවදුරටත් පැතිරේ නම් "
            "කෘෂිකර්ම නිලධාරියෙකුගෙන් උපදෙස් ලබාගන්න."
        ),

        "prevention": (
            "Maintain field sanitation, provide adequate spacing between "
            "plants, and avoid conditions that create excessive humidity. "
            "Inspect leaves regularly for new spots."
        ),
        "prevention_si": (
            "වගා බිම පිරිසිදුව පවත්වා ගන්න. පැළ අතර නිසි "
            "පරතරයක් තබන්න. අධික තෙතමනය ඇතිවන තත්ත්වයන් "
            "අවම කරන්න. නව පුල්ලි ඇතිවී තිබේදැයි පත්‍ර "
            "නිරන්තරයෙන් පරීක්ෂා කරන්න."
        ),

        "source": (
            "Sri Lanka Department of Agriculture - HORDI Capsicum "
            "cultivation guidance. Guidance refers to Capsicum annuum."
        ),
        "source_url": "https://doa.gov.lk/sinhala-hordi-crop-capsicum/"
    },


    # 3. Healthy Leaf
    "Healthy": {
        "display_name": "Healthy Leaf",
        "display_name_si": "නිරෝගී පත්‍රය",

        "curable": "No treatment required",
        "curable_si": "ප්‍රතිකාර අවශ්‍ය නොවේ",

        "action": (
            "No disease treatment is indicated by this prediction. "
            "Continue normal crop management and monitor the plant "
            "regularly for any new symptoms."
        ),
        "action_si": (
            "මෙම අනාවැකිය අනුව රෝග ප්‍රතිකාරයක් අවශ්‍ය බව "
            "පෙන්වන්නේ නැත. සාමාන්‍ය වගා කළමනාකරණ කටයුතු "
            "අඛණ්ඩව සිදු කරන්න. නව රෝග ලක්ෂණ ඇතිවන්නේදැයි "
            "පැළ නිරන්තරයෙන් පරීක්ෂා කරන්න."
        ),

        "prevention": (
            "Maintain proper field sanitation, suitable plant spacing, "
            "and regular crop inspections. Use healthy planting material "
            "and follow local agricultural guidance."
        ),
        "prevention_si": (
            "වගා බිම පිරිසිදුව පවත්වා ගන්න. පැළ අතර සුදුසු "
            "පරතරයක් තබන්න. වගාව නිරන්තරයෙන් පරීක්ෂා කරන්න. "
            "නිරෝගී රෝපණ ද්‍රව්‍ය භාවිත කර ප්‍රදේශයේ "
            "කෘෂිකර්ම උපදෙස් අනුගමනය කරන්න."
        ),

        "source": (
            "General crop-monitoring advice. No disease treatment is "
            "required for a healthy prediction."
        ),
        "source_url": "https://doa.gov.lk/hordi-crop-capsicum/"
    },


    # 4. Chilli Leaf Curl
    "Leaf_Curl": {
        "display_name": "Chilli Leaf Curl",
        "display_name_si": "මිරිස් කොළ කොඩවීමේ රෝගය",

        "curable": "Virus management and prevention",
        "curable_si": "වෛරසය පැතිරීම පාලනය කිරීම සහ වැළැක්වීම",

        "action": (
            "Leaf curl is associated with a virus and whiteflies are "
            "identified as a vector in the DOA/HORDI Capsicum guidance. "
            "Inspect plants for whiteflies and remove and destroy "
            "severely affected plants after confirming the symptoms. "
            "For approved whitefly management methods, consult a local "
            "Agriculture Instructor. Do not select pesticides or doses "
            "based only on this AI prediction."
        ),
        "action_si": (
            "කොළ කොඩවීම වෛරසයක් සමඟ සම්බන්ධ රෝග තත්ත්වයක් වන "
            "අතර HORDI මාර්ගෝපදේශ අනුව සුදු මැස්සා එම වෛරසයේ "
            "වාහකයෙකු ලෙස ක්‍රියා කරයි. පැළවල සුදු මැස්සන් "
            "සිටිනවාදැයි පරීක්ෂා කරන්න. රෝග ලක්ෂණ තහවුරු "
            "කිරීමෙන් පසු දැඩි ලෙස ආසාදිත පැළ ගලවා විනාශ "
            "කරන්න. සුදු මැස්සන් පාලනය සඳහා අනුමත ක්‍රම "
            "පිළිබඳව කෘෂිකර්ම නිලධාරියෙකුගෙන් උපදෙස් ලබාගන්න. "
            "මෙම AI ප්‍රතිඵලය පමණක් පදනම් කරගෙන කෘමිනාශක "
            "හෝ මාත්‍රා තෝරා නොගන්න."
        ),

        "prevention": (
            "Use good-quality planting material and maintain proper "
            "nursery management. Follow timely cultivation practices, "
            "use suitable wind barriers where appropriate, and remove "
            "alternative host plants and weeds around the crop. "
            "Monitor whiteflies and inspect plants regularly."
        ),
        "prevention_si": (
            "හොඳ තත්ත්වයේ රෝපණ ද්‍රව්‍ය භාවිත කර තවාන නිසි "
            "පරිදි කළමනාකරණය කරන්න. නිසි කාලයට වගා කටයුතු "
            "සිදු කරන්න. සුදුසු ස්ථානවල සුළං බාධක භාවිත කරන්න. "
            "වගාව අවට ඇති වල් පැළෑටි සහ වෛරසයට ධාරක විය "
            "හැකි වෙනත් පැළ ඉවත් කරන්න. සුදු මැස්සන් සිටිනවාදැයි "
            "නිරන්තරයෙන් පරීක්ෂා කරන්න."
        ),

        "source": (
            "Sri Lanka Department of Agriculture - HORDI Capsicum "
            "guidance on leaf curl virus and whitefly management. "
            "Guidance refers to Capsicum annuum."
        ),
        "source_url": "https://doa.gov.lk/sinhala-hordi-crop-capsicum/"
    },


    # 5. Powdery Mildew
    "Powdery_Mildew": {
        "display_name": "Powdery Mildew",
        "display_name_si": "පිටි පුස් රෝගය",

        "curable": "Management possible",
        "curable_si": "නිසි කළමනාකරණය මඟින් පාලනය කළ හැකිය",

        "action": (
            "Improve air movement around plants by maintaining suitable "
            "spacing and controlling weeds. Remove heavily affected "
            "plant material where appropriate and maintain field "
            "sanitation. The DOA/HORDI guidance also mentions Trichoderma "
            "spp. as a management option. Confirm the suitable product "
            "and application method with an Agriculture Instructor."
        ),
        "action_si": (
            "පැළ අතර සුදුසු පරතරයක් පවත්වා ගනිමින් වාතාශ්‍රය "
            "හොඳින් ලැබෙන පරිදි වගාව සකස් කරන්න. වල් පැළෑටි "
            "පාලනය කරන්න. අවශ්‍ය අවස්ථාවලදී දැඩි ලෙස රෝගය "
            "වැළඳුණු ශාක කොටස් ඉවත් කර වගා බිම පිරිසිදුව "
            "පවත්වා ගන්න. HORDI මාර්ගෝපදේශවල Trichoderma "
            "දිලීර විශේෂ ද කළමනාකරණ විකල්පයක් ලෙස සඳහන් වේ. "
            "එය භාවිත කිරීමට සුදුසු නිෂ්පාදනය සහ යෙදීමේ "
            "ක්‍රමය කෘෂිකර්ම නිලධාරියෙකුගෙන් තහවුරු කරගන්න."
        ),

        "prevention": (
            "Maintain field sanitation, provide proper spacing between "
            "plants, and control weeds to improve air circulation. "
            "Inspect plants regularly and consider locally recommended "
            "resistant varieties where available."
        ),
        "prevention_si": (
            "වගා බිම පිරිසිදුව පවත්වා ගන්න. පැළ අතර නිසි "
            "පරතරයක් තබා වාතාශ්‍රය වැඩි කරන්න. වල් පැළෑටි "
            "පාලනය කරන්න. පැළ නිරන්තරයෙන් පරීක්ෂා කරන්න. "
            "ප්‍රදේශයට සුදුසු ලෙස නිර්දේශ කර ඇති රෝගවලට "
            "ඔරොත්තු දෙන ප්‍රභේද තිබේ නම් ඒවා පිළිබඳව "
            "කෘෂිකර්ම නිලධාරියෙකුගෙන් විමසන්න."
        ),

        "source": (
            "Sri Lanka Department of Agriculture - HORDI Capsicum "
            "powdery mildew management guidance. Guidance refers to "
            "Capsicum annuum."
        ),
        "source_url": "https://doa.gov.lk/hordi-crop-capsicum/"
    }
}
