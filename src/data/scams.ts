/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScamInfo } from "../types";

export const SCAMS_DATA: ScamInfo[] = [
  {
    id: "digital-arrest",
    title: "Digital Arrest Scam",
    subtitle: "Fake police or CBI officers threatening arrest over skype/video calls",
    dangerLevel: "Critical",
    whatItIs: "Criminals call you claiming a package containing illegal items (like drugs or fake passports) was sent in your name, or that your phone number was used in money laundering. They threaten immediate arrest and force you to stay on a video call ('digital arrest') for hours while they coerce you to transfer money into a 'safe bank account' for verification.",
    howItWorks: [
      "You receive an automated call claiming your ID/SIM is flagged by customs, police, or courier companies.",
      "The call is transferred to scammers dressed as police officers or CBI investigators sitting in fake police station setups.",
      "They show forged warrants, cite state laws, and order you to lock your doors and stay on video.",
      "They demand you transfer your entire bank balance to 'government verification accounts' which they promise will be refunded."
    ],
    warningSigns: [
      "Any caller claiming to place you under 'Digital Arrest'—there is NO such legal procedure under Indian law.",
      "Pressure to keep the video call or voice call connected continuously, forbidding you to speak to family.",
      "Demands to keep the entire setup confidential under the threat of immediate jail time.",
      "Requests to wire transfer large sums to personal bank accounts under the guise of 'CBI clearing accounts'."
    ],
    whatNotToDo: [
      "DO NOT transfer any money for 'verification' or 'temporary bail.' The police never ask for audits.",
      "DO NOT panic or show your bank screen contents on the video feed.",
      "DO NOT stay on the call. Do not let them isolate you from physical support."
    ],
    safeActions: [
      "Hang up immediately! No genuine Indian police officer conducts investigations or gives bail via video calls.",
      "Contact your nearest local police station or dial the National Cyber Crime Helpline at 1930.",
      "Report the social media or messaging usernames (Skype/WhatsApp numbers) immediately.",
      "Talk to family members or trusted friends right away and let them know about the incident."
    ],
    bannerPrompt: "A high-contrast cybercrime warning card explaining fake video arrest threats"
  },
  {
    id: "investment",
    title: "High-Return Investment Scam",
    subtitle: "Fake Telegram stock advice and simulated high-profit apps",
    dangerLevel: "Critical",
    whatItIs: "Scammers add you to WhatsApp/Telegram groups led by fake financial 'gurus' sharing massive profit screenshots. They convince you to download private APKs or register on websites that look like reputable international trading terminals, then show simulated skyrocketing stock accounts to force you to invest more money.",
    howItWorks: [
      "They contact you on Telegram with 'institutional stock tips' or part-time 'likes/ratings tasks'.",
      "They direct you to sign up on a fake portal with a small deposit (e.g. ₹1,000) and immediately let you withdraw ₹1,300 to build trust.",
      "They push you to invest lakhs for 'VIP shares' or 'block-trading pre-allocations'.",
      "When you try to withdraw your profits, they lock your account and demand high 'income tax fees' or 'handling charges' to release funds."
    ],
    warningSigns: [
      "Guaranteed returns of 10% to 50% weekly or daily.",
      "Interactive dashboards showing huge profits that exist only inside a website they provided.",
      "Pressure to deposit funds dynamically to personal UPI IDs or shell bank accounts rather than registered SEBI brokers.",
      "Lack of registration on the official SEBI (Securities and Exchange Board of India) portal."
    ],
    whatNotToDo: [
      "DO NOT trust screen screenshots of high bank credits—these are easily forged with simple graphics templates.",
      "DO NOT deposit additional 'tax funds' to unlock frozen balances. This is a bottomless trap.",
      "DO NOT install custom `.apk` files given inside chats to check stock balances."
    ],
    safeActions: [
      "Verify if the investment advisor is registered with SEBI. Double check official websites.",
      "Report the bank accounts, UPI handles, and chat group link immediately to the Indian Cybercrime Portal.",
      "If you traded via suspicious portals, change your banking and password credentials immediately."
    ],
    bannerPrompt: "A digital coin matrix highlighting a trap with false high profit graphs"
  },
  {
    id: "kyc-update",
    title: "KYC / SIM Blocked Scam",
    subtitle: "Urgent SMS warnings about bank or SIM card deactivation",
    dangerLevel: "High",
    whatItIs: "You receive an urgent text message warning that your bank account, credit card, or SIM card will be blocked within 24 hours because your KYC is incomplete. They give a phone number to contact a customs officer or helper, who guides you to click a link to log into a fake banking site, or install a remote-viewing app to 'confirm details'.",
    howItWorks: [
      "A text message appears looking official: 'Dear Customer, your SBI account is blocked. Update KYC immediately at link...'",
      "You call the phone number or click the link, landing on a clone of your bank's net banking page.",
      "The scammer on the phone asks you to read the OTP sent to your phone to 'authenticate' your KYC status.",
      "Within seconds, they trigger fund transfers using the OTP you read to them, instantly draining the account."
    ],
    warningSigns: [
      "Urgency threats (e.g., 'SIM will block under 1 hour', 'PAN card expired').",
      "SMS contains a mobile number for 'customer care' rather than registered toll-free lines.",
      "Messages containing shortened links or suspicious domain names (e.g., update-block-sim.com).",
      "Demands to confirm your online password, card PIN, or secure OTP."
    ],
    whatNotToDo: [
      "NEVER call the phone number provided in the SMS. Look up your bank's official number on your physical card.",
      "NEVER enter passwords, banking details, or UPI PINs on portals linked from SMS.",
      "DO NOT share any verification OTP. No bank or telecom agent will ever ask for an OTP over a voice call."
    ],
    safeActions: [
      "Immediately ignore and delete the message.",
      "If any doubt remains, walk physically into your bank branch or call the official customer care on your credit/debit card.",
      "Report the sender ID (e.g., VM-BANKXX) on the Sanchar Saathi portal to block fraud telemarketers."
    ],
    bannerPrompt: "An alert card showing a fake text warning for card blocking"
  },
  {
    id: "loan-app",
    title: "Predatory Instant Loan App",
    subtitle: "Fast-approval micro loans with invasive contact permissions",
    dangerLevel: "High",
    whatItIs: "Fake mobile apps offer instant hassle-free loans of ₹5,000 without collateral. Once installed, the apps silently download your entire contacts list, photo gallery, and location. Even if you pay back, scammers manipulate figures and threaten to share morphed private photos with your entire contacts list to extort money.",
    howItWorks: [
      "You click an ad on Instagram or search on unverified sites for quick cash.",
      "The app forces you to accept extensive device permissions (Contacts, Photos, Call Logs) before approval.",
      "They deposit a portion of the loan (e.g., ₹3,000 for a ₹5,000 loan) and demand ₹8,000 within just 7 days.",
      "If you fail or even after paying, they send WhatsApp threats featuring your Aadhaar photo and obscene edits to your relatives."
    ],
    warningSigns: [
      "Extensive micro-permissions requested for a basic informational utility.",
      "Interest rates and hidden fees that change dynamically or extremely short repayment periods (under 15 days).",
      "Lack of association with clear Reserve Bank of India (RBI) registered NBFCs (Non-Banking Financial Companies).",
      "Customer support uses personal WhatsApp accounts or Gmail addresses."
    ],
    whatNotToDo: [
      "DO NOT grant 'Contacts' or 'Files' permission to any micro-finance app unless they are fully verified bank applications.",
      "DO NOT submit to extortion or pay extra blackmail amounts. Once you pay blackmailers, they will keep demanding more.",
      "DO NOT download installation packages (.apk) directly from browsers."
    ],
    safeActions: [
      "Uninstall the app immediately if you already downloaded it.",
      "File an immediate police and cyber complaint reporting the harassment, WhatsApp numbers, and extortion calls.",
      "Alert your close friends and parents that your phone contacts were compromised by a fraud app, and to ignore any messages sent in your name."
    ],
    bannerPrompt: "A graphic of mobile micro loan apps showing extreme permissions flags"
  },
  {
    id: "upi-collect",
    title: "UPI Collect Request Scam",
    subtitle: "Fraudulent money requests disguised as lottery winnings or refunds",
    dangerLevel: "High",
    whatItIs: "Scammers send a payment request onto your UPI application (GPay, PhonePe, Paytm) under titles like 'Refund Issued', 'KBC Lottery Winner', or 'Bank Cash Back'. They trick you on the phone into typing your secure UPI PIN, falsely stating that typing your PIN is required to 'receive' the money.",
    howItWorks: [
      "They call you claiming you won a cash reward, or are getting a refund for an OLX purchase.",
      "They say, 'I am sending a request on Google Pay. Tap accept and enter your UPI PIN to claim your prize.'",
      "They keep you talking so you don't read the screen interface warning.",
      "When you enter your UPI PIN, you are actually AUTHORIZING a debit, and money is immediately transferred to them."
    ],
    warningSigns: [
      "Any statement that you must enter your **UPI PIN** to **receive or credit** money. You never need a PIN to receive money.",
      "UPI popup notifications showing 'Pay' rather than 'Receive Fund'.",
      "Strange WhatsApp calls instructing you word-by-word on how to navigate your payment apps."
    ],
    whatNotToDo: [
      "DO NOT enter your UPI PIN under any circumstances during external calls or for claimed refunds.",
      "DO NOT trust transactions marked as 'pending lottery approval' in your payment history.",
      "DO NOT give out your linked UPI mobile number to unverified marketplace buyers."
    ],
    safeActions: [
      "Decline the 'Collect Request' immediately on PhonePe/GPay.",
      "Block the sender's UPI ID inside your application—this flags their merchant profile to the authorities.",
      "If you did enter your PIN, call your bank manager immediately to block outgoing UPI transfers, change your UPI PIN, and register a complaint via 1930."
    ],
    bannerPrompt: "A warning of a mobile screen showing a fake UPI collect request popup"
  },
  {
    id: "fake-delivery",
    title: "Fake Delivery & Address Scam",
    subtitle: "Unordered parcel notifications asking for small OTP or address verification charges",
    dangerLevel: "Medium",
    whatItIs: "You receive a message or call claiming a package from India Post, DHL, or Blue Dart could not be delivered due to an incorrect PIN code or missing address. They supply a link to edit your address and pay a nominal fee (e.g., ₹25), using this tiny gateway to steal your complete credit card or net banking login.",
    howItWorks: [
      "A realistic SMS states: 'IndiaPost: Your parcel has arrived but is on hold. Update address inside 24h: link...'",
      "The page looks like a perfect governmental India Post or courier hub form.",
      "You fill in your complete home address, mobile number, and card details.",
      "The payment page requests a tiny charge of ₹20-₹50, but behind the scenes, scammers use your card credentials on a global ecommerce site to charge thousands, intercepting the high-value OTP you submit."
    ],
    warningSigns: [
      "Receiving a delivery failure alert when you have not ordered any active parcels.",
      "SMS uses public domain senders or suspicious web addresses (e.g., indiapost-tracking-log.net).",
      "Requirements to pay credit card payment details for small postage issues."
    ],
    whatNotToDo: [
      "DO NOT click tracking links from unknown numbers.",
      "DO NOT fill in your banking or card details on unencrypted, non-secured websites.",
      "DO NOT read out OTPs generated during 'parcel release' transactions."
    ],
    safeActions: [
      "Ignore the text. Search for the genuine courier website officially to track existing orders directly.",
      "If you inputted card credentials, freeze/block your credit card instantly via your banking app.",
      "Report the scam links using the SecureVault Link Protection tool or online safety tools."
    ],
    bannerPrompt: "An address verification card with fraudulent postal delivery markings"
  },
  {
    id: "fake-job",
    title: "Fake Part-Time Job Scam",
    subtitle: "Paid likes on YouTube videos or rating hotels on Google Maps",
    dangerLevel: "High",
    whatItIs: "Scammers recruit you for incredibly simple remote jobs, like liking videos or adding reviews on Google reviews, giving short daily payouts. Once you are hooked, they add you to advanced Telegram salary channels and demand 'guarantee deposits' or 'crypto tax fees' to unlock higher tasks, vanishing with your family's savings.",
    howItWorks: [
      "You receive a WhatsApp message: 'Earn ₹3,000 per day by rating hotels in your free time.'",
      "They pay you ₹150 for the first 3 simple screenshots of hotel likes to gain total confidence.",
      "They invite you to a group and suggest 'pre-paid investment missions' where you send ₹5,000 to get back ₹6,500.",
      "They scale the demands into lakhs. If you stop paying or fail to execute a 'sequence', they freeze your entire balance."
    ],
    warningSigns: [
      "High pay for simple clerical, liking, or rating tasks that require no qualifications.",
      "Told to communicate exclusively through Telegram or WhatsApp without formal HR email channels.",
      "Forced to buy virtual portfolios or pay money to 'level up' your performance rank."
    ],
    whatNotToDo: [
      "NEVER pay money to get a job or unlock task salaries. No legitimate hiring agency charges candidates processing fees.",
      "DO NOT share screen streaming access while executing task procedures.",
      "DO NOT recruit friends or family to join these schemes to get referral bonuses."
    ],
    safeActions: [
      "Disengage from the chat immediately and flag the group chat.",
      "Report the bank accounts they provided to send funds—this aids banking cyber cells in freezing their active accounts.",
      "File your transaction slips and reports on the national portal."
    ],
    bannerPrompt: "A job recruitment card offering daily payments for simple social tasks"
  },
  {
    id: "sextortion",
    title: "Sextortion Blackmail",
    subtitle: "Video screen recordings of private calls used for heavy leverage",
    dangerLevel: "Critical",
    whatItIs: "An attractive stranger initiates an intimate video call on WhatsApp or Instagram. Once you answer, they play an explicit video and screen-record your face next to it. They immediately send you the captured video and threaten to blast it to your family, neighbors, and coworkers on Facebook unless massive digital payouts are made.",
    howItWorks: [
      "You get a random friend request on social media or direct video calls from unknown profiles.",
      "When you answer, you see a semi-clothed video or screen. Scammers capture your confused face on a recording.",
      "They display screenshots of your contacts list (harvested from social media metadata or custom apps you installed).",
      "They threaten exposure, suicide threats, or fake cyber police calls if you don't pay UPI collections immediately."
    ],
    warningSigns: [
      "Strangers pushing for immediate video chats within minutes of basic greeting messages.",
      "Profile photo is highly stylized or looks simulated/downloaded.",
      "Unsolicited sent photo files or app links targeting video features."
    ],
    whatNotToDo: [
      "DO NOT pay any money. Scammers NEVER delete the video. Once you pay, they realize you are fearful and will blackmail you for months.",
      "DO NOT argue with the blackmailer or act desperate. Desperation increases their leverage.",
      "DO NOT delete the record of conversations before preserving evidence."
    ],
    safeActions: [
      "Deactivate your public social media accounts immediately (Facebook, Instagram) to prevent them from contacting your relatives.",
      "Take screenshots of their threat messages, UPI demands, and calling numbers.",
      "Report the incident immediately on cybercrime.gov.in and to your local police. They deal with these cases daily and can guide you.",
      "Seek mental support immediately—do not remain isolated or feel ashamed; this is a organized mechanical crime."
    ],
    bannerPrompt: "A security lock icon with caution flags indicating blackmail threats"
  },
  {
    id: "apk-install",
    title: "Risky / Suspicious APK Scam",
    subtitle: "Installing unverified APK packages for sports, rewards, or technical support",
    dangerLevel: "High",
    whatItIs: "Fraudsters direct you to install specific Android packages (.apk files) sent manually over Whatsapp or shared on blogs, claiming they are needed to check your electricity bill, view parcel tracking, watch premium soccer matches, or receive government cash balances. These files are Trojan horse programs designed to intercept your messages.",
    howItWorks: [
      "An electricity department representative calls: 'Your power cuts tonight! Download this APP from WhatsApp to pay ₹10 bill.'",
      "They send an installer called `UrgentBillSupport.apk`.",
      "You bypass Google/Android security dialog warnings to install it.",
      "The app logs into your background services, reads all incoming OTPs, and relays them to the scammer's database, letting them drain your bank accounts silently."
    ],
    warningSigns: [
      "Any file ending in `.apk` transmitted over personal communication channels like WhatsApp.",
      "Websites with red alert text saying 'Enable Unknown Sources' to get a prize.",
      "Applications requesting permission to 'Read SMS', 'View Notifications', or 'Control Device Accessibility'."
    ],
    whatNotToDo: [
      "NEVER bypass Android's system warnings to install apps outside the official Google Play Store.",
      "DO NOT trust utility workers who ask you to download software through direct messaging files.",
      "DO NOT ignore alerts from your existing mobile antivirus or security suites."
    ],
    safeActions: [
      "Uninstall the unverified app immediately! Go to Settings -> Apps, locate the suspicious installer, clean cache, and delete it.",
      "Install the SecureVault app (once launched) to scan folders for leftover files.",
      "Change net banking passwords and contact credit card suppliers to block transactions since your SMS might have been intercepted."
    ],
    bannerPrompt: "A custom smartphone with malware file flags and security warnings"
  },
  {
    id: "remote-access",
    title: "Screen Sharing / Remote Access Fraud",
    subtitle: "Downloading apps like Anydesk or TeamViewer to fix technical issues",
    dangerLevel: "High",
    whatItIs: "A fake bank officer, telecom technician, or phone merchant calls claiming they want to help you fix a system error or reverse a wrong transaction charges. They direct you to download a common remote access app (like AnyDesk, TeamViewer, or RustDesk) and read out the connection ID, giving them complete remote control of your phone and accounts.",
    howItWorks: [
      "They claim your Google Pay is stuck or you are being refunded ₹5,000.",
      "They direct you: 'Install AnyDesk app from Play Store. We will inspect the error logs remotely.'",
      "You read the 9-digit connection code, allowing them to cast your phone screen live onto their computer.",
      "They ask you to log into your bank app 'to check stability.' They watch your passwords, OTP SMS, and secure credentials in real-time, completing unauthorized transfers."
    ],
    warningSigns: [
      "Any agent directing you to download AnyDesk, TeamViewer, RustDesk, or screenshare utilities.",
      "Callers asking you to open bank apps while keeping a technical phone support call active.",
      "Requests to read configuration numbers or security codes shown inside screensharing panels."
    ],
    whatNotToDo: [
      "NEVER open your net banking, UPI apps, or credit card portals while sharing your screen.",
      "NEVER read out active connection codes or touch 'Allow Access' inside system remote dialogs.",
      "DO NOT share your phone screen during online customer helpline calls."
    ],
    safeActions: [
      "Hang up and exit the remote application completely.",
      "Uninstall the screen sharing utilities from your device or turn off your active Wi-Fi/Mobile network to break the session immediately.",
      "Change critical app passwords and lock UPI profiles if banking screens were shown on screen."
    ],
    bannerPrompt: "A modern dual monitor graphic indicating remote screen mirroring warning"
  },
  {
    id: "deepfake",
    title: "Deepfake Voice / Video Impersonation",
    subtitle: "AI voice clones calling parents pleading urgent bail or hospital bills",
    dangerLevel: "Critical",
    whatItIs: "Scammers harvest short video clips of you or your children from social media to generate an exact copy of your voice using AI. They call your parents or relatives, crying in panic that you were arrested, met with a critical car crash, or are held by kidnappers, desperately pleading for direct UPI wire transfers values.",
    howItWorks: [
      "Scammers call an older family member. The voice sounds exactly like you, sobbing: 'Dad! I made a mistake, police locked me up! Please pay ₹50,000 deposit immediately to this lawyer ID...'",
      "A fake police inspector takes over the call, demanding immediate UPI payments to block instant booking.",
      "Due to extreme family panic and voice matching, parents rush to make payments before verifying."
    ],
    warningSigns: [
      "An urgent panic call from your relative requesting fast money, but calling from a strange phone number.",
      "Voice sounds slightly metallic or contains unnatural speech pauses despite the correct tone.",
      "Refusal to let your parents call you directly on your primary mobile number."
    ],
    whatNotToDo: [
      "DO NOT transfer money immediately without verified authentication.",
      "DO NOT share critical travel updates or itineraries publicly on Instagram and Facebook trackers.",
      "DO NOT make decisions while emotionally shocked or pressured."
    ],
    safeActions: [
      "Hang up and call your child or relative directly on their known personal phone number—even if they claim it is switched off.",
      "Ask a specific personal question ('What is our dog's name?', 'Where did we eat last week?') that AI models cannot guess from internet files.",
      "If you cannot contact them, call a physical friend, office coworker, or teacher located near them to double-check their safety."
    ],
    bannerPrompt: "An AI voice waveform overlapping custom biometric verification icons"
  }
];
