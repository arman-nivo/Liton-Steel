/**
 * Seed copy transcribed from the 2024/2026 company profile (English), corrected where the PDF had
 * obvious errors, plus Bangla translations. Every string is editable in the editor afterwards.
 */
import type { L10n } from "../schema/types";

export const COMPANY = {
  name: { en: "M/S Liton Steel", bn: "মেসার্স লিটন স্টিল" },
  shortName: { en: "Liton Steel", bn: "লিটন স্টিল" },
  tagline: { en: "Steel structure & civil construction since 1990", bn: "১৯৯০ সাল থেকে স্টিল স্ট্রাকচার ও সিভিল নির্মাণ" },
  phone: "+880 1711-451762",
  whatsapp: "8801711451762",
  email: "liton.steel.kst@gmail.com",
  address: { en: "Dadapur Road, Mojompur, Kushtia, Bangladesh", bn: "দাদাপুর রোড, মজমপুর, কুষ্টিয়া, বাংলাদেশ" },
  mapQuery: "Dadapur Road, Mojompur, Kushtia, Bangladesh",
  founded: 1990,
};

export const NAV: { id: string; label: L10n; href: string }[] = [
  { id: "about", label: { en: "About Company", bn: "কোম্পানি পরিচিতি" }, href: "/#about" },
  { id: "ceo", label: { en: "CEO Message", bn: "সিইও-র বার্তা" }, href: "/#ceo-message" },
  { id: "vision", label: { en: "Vision & Mission", bn: "ভিশন ও মিশন" }, href: "/#vision-mission" },
  { id: "milestone", label: { en: "Milestone", bn: "মাইলফলক" }, href: "/#milestone" },
  { id: "service", label: { en: "Our Service", bn: "আমাদের সেবা" }, href: "/#our-service" },
  { id: "process", label: { en: "The Process", bn: "কার্যপ্রণালী" }, href: "/#the-process" },
  { id: "goals", label: { en: "Our Goals", bn: "আমাদের লক্ষ্য" }, href: "/#our-goals" },
  { id: "projects", label: { en: "Our Project", bn: "আমাদের প্রকল্প" }, href: "/#our-projects" },
  { id: "team", label: { en: "Meet the Team", bn: "আমাদের টিম" }, href: "/#meet-the-team" },
];

export const COVER = {
  label: { en: "M/S LITON STEEL", bn: "মেসার্স লিটন স্টিল" },
  heading: { en: '<span class="outline">BUSINESS</span><br>COMPANY<br>PROFILE', bn: '<span class="outline">বিজনেস</span><br>কোম্পানি<br>প্রোফাইল' },
  year: { en: "2026", bn: "২০২৬" },
  address: { en: "DADAPUR ROAD, MOJOMPUR, KUSHTIA", bn: "দাদাপুর রোড, মজমপুর, কুষ্টিয়া" },
  ctaProjects: { en: "Our projects", bn: "আমাদের প্রকল্প" },
  ctaContact: { en: "Let's connect", bn: "যোগাযোগ করুন" },
};

export const WELCOME = {
  hi: { en: "HI THERE!", bn: "স্বাগতম!" },
  heading: { en: "WELCOME<br>TO LITON STEEL", bn: "লিটন স্টিলে<br>আপনাকে স্বাগত" },
  stats: [
    { value: 35, suffix: "+", label: { en: "Years of experience", bn: "বছরের অভিজ্ঞতা" } },
    { value: 100, suffix: "+", label: { en: "Projects delivered", bn: "প্রকল্প সম্পন্ন" } },
    { value: 10, suffix: "+", label: { en: "Corporate clients", bn: "প্রাতিষ্ঠানিক গ্রাহক" } },
  ],
};

export const ABOUT = {
  heading: { en: "ABOUT<br>COMPANY", bn: "কোম্পানি<br>পরিচিতি" },
  p1: {
    en: "For 35 years, Liton Steel has stood as a cornerstone of excellence in Bangladesh's construction industry, solidifying its reputation as one of the nation's most trusted and innovative builders. From modest beginnings, the company has evolved into a powerhouse of engineering prowess, consistently delivering projects that shape the country's skyline and infrastructure. At the heart of Liton Steel's success lies its unwavering commitment to quality and professionalism, meticulously cultivating a team of highly skilled engineers, architects, and craftsmen who bring a wealth of expertise to every project. This collective knowledge, honed over decades, allows Liton Steel to tackle challenges with confidence and creativity, ensuring optimal outcomes for clients across diverse sectors.",
    bn: "৩৫ বছর ধরে লিটন স্টিল বাংলাদেশের নির্মাণ শিল্পে উৎকর্ষের এক ভিত্তিস্তম্ভ হিসেবে দাঁড়িয়ে আছে এবং দেশের অন্যতম বিশ্বস্ত ও উদ্ভাবনী নির্মাতা হিসেবে সুনাম অর্জন করেছে। ছোট পরিসরে যাত্রা শুরু করে প্রতিষ্ঠানটি আজ প্রকৌশল দক্ষতার এক শক্তিশালী কেন্দ্রে পরিণত হয়েছে, যা ধারাবাহিকভাবে দেশের স্কাইলাইন ও অবকাঠামো গড়ে তোলা প্রকল্প বাস্তবায়ন করছে। লিটন স্টিলের সাফল্যের মূলে রয়েছে মান ও পেশাদারিত্বের প্রতি অবিচল অঙ্গীকার—দক্ষ প্রকৌশলী, স্থপতি ও কারিগরদের একটি টিম, যারা প্রতিটি প্রকল্পে তাদের অভিজ্ঞতার সম্ভার নিয়ে আসেন। দশকের পর দশক ধরে অর্জিত এই সম্মিলিত জ্ঞান লিটন স্টিলকে আত্মবিশ্বাস ও সৃজনশীলতার সঙ্গে যেকোনো চ্যালেঞ্জ মোকাবিলা করতে এবং বিভিন্ন খাতের গ্রাহকদের জন্য সর্বোত্তম ফলাফল নিশ্চিত করতে সক্ষম করে।",
  },
  p2: {
    en: "What truly distinguishes Liton Steel is its comprehensive service portfolio and remarkable adaptability. The company excels in engineering construction, foundation work, civil construction, real estate development, and contracting services, approaching each project with the same level of dedication and attention to detail, whether breathing new life into a heritage building or pushing the boundaries of modern architecture. As Bangladesh continues its trajectory of rapid development, Liton Steel remains at the forefront of innovation, consistently investing in the latest construction technologies and sustainable practices. With a legacy built on integrity, expertise, and a passion for excellence, Liton Steel stands ready to tackle the construction challenges of tomorrow, reaffirming its commitment to building not just structures, but a stronger, more vibrant Bangladesh for generations to come.",
    bn: "লিটন স্টিলকে যা সত্যিই আলাদা করে তা হলো এর বিস্তৃত সেবা পরিসর ও অসাধারণ অভিযোজন ক্ষমতা। প্রকৌশল নির্মাণ, ফাউন্ডেশন কাজ, সিভিল নির্মাণ, রিয়েল এস্টেট উন্নয়ন ও কন্ট্রাক্টিং সেবায় প্রতিষ্ঠানটি সমান নিষ্ঠা ও সূক্ষ্ম মনোযোগে কাজ করে—তা কোনো ঐতিহ্যবাহী ভবনে নতুন প্রাণ সঞ্চার হোক বা আধুনিক স্থাপত্যের সীমানা প্রসারিত করা হোক। বাংলাদেশ যখন দ্রুত উন্নয়নের পথে এগিয়ে চলেছে, লিটন স্টিল সর্বাধুনিক নির্মাণ প্রযুক্তি ও টেকসই পদ্ধতিতে ধারাবাহিক বিনিয়োগের মাধ্যমে উদ্ভাবনের অগ্রভাগে রয়েছে। সততা, দক্ষতা ও উৎকর্ষের প্রতি আবেগে গড়া ঐতিহ্য নিয়ে লিটন স্টিল আগামীর নির্মাণ চ্যালেঞ্জ মোকাবিলায় প্রস্তুত—শুধু স্থাপনা নয়, প্রজন্মের জন্য আরও শক্তিশালী ও প্রাণবন্ত বাংলাদেশ গড়ার অঙ্গীকার নিয়ে।",
  },
};

export const CEO = {
  heading: { en: "CEO<br>MESSAGE", bn: "সিইও-র<br>বার্তা" },
  name: { en: "Abu Hassan Liton", bn: "আবু হাসান লিটন" },
  role: { en: "CEO & Founder", bn: "সিইও ও প্রতিষ্ঠাতা" },
  p1: {
    en: "As the CEO of Liton Steel, I am immensely proud of our 35-year journey in Bangladesh's construction industry. Our company has grown from humble beginnings to become a leader in engineering construction, foundation work, civil construction, real estate development, and contracting services. This success is built on the dedication of our talented team, the trust of our clients, and our unwavering commitment to quality and innovation. Throughout our history, we have shaped skylines, strengthened infrastructure, and contributed to the vibrant growth of our nation.",
    bn: "লিটন স্টিলের সিইও হিসেবে বাংলাদেশের নির্মাণ শিল্পে আমাদের ৩৫ বছরের পথচলায় আমি অত্যন্ত গর্বিত। সামান্য শুরু থেকে আমাদের প্রতিষ্ঠান আজ প্রকৌশল নির্মাণ, ফাউন্ডেশন কাজ, সিভিল নির্মাণ, রিয়েল এস্টেট উন্নয়ন ও কন্ট্রাক্টিং সেবায় একটি অগ্রণী প্রতিষ্ঠানে পরিণত হয়েছে। এই সাফল্য গড়ে উঠেছে আমাদের মেধাবী টিমের নিষ্ঠা, গ্রাহকদের আস্থা এবং মান ও উদ্ভাবনের প্রতি আমাদের অবিচল অঙ্গীকারের ওপর। আমাদের ইতিহাস জুড়ে আমরা স্কাইলাইন গড়েছি, অবকাঠামো মজবুত করেছি এবং দেশের প্রাণবন্ত অগ্রযাত্রায় অবদান রেখেছি।",
  },
  p2: {
    en: "Looking to the future, Liton Steel remains dedicated to pushing boundaries and setting new standards in our field. We continue to invest in cutting-edge technologies and sustainable practices, ensuring that our projects not only meet but exceed international standards. Our adaptability and comprehensive expertise allow us to tackle diverse challenges, from heritage restoration to modern architectural marvels. As we move forward, we reaffirm our commitment to building not just structures, but a stronger, more prosperous Bangladesh for generations to come. Thank you for your trust in Liton Steel – together, we are constructing the future of our nation.",
    bn: "ভবিষ্যতের দিকে তাকিয়ে লিটন স্টিল সীমানা পেরিয়ে যাওয়া এবং এই খাতে নতুন মানদণ্ড স্থাপনে প্রতিশ্রুতিবদ্ধ। আমরা অত্যাধুনিক প্রযুক্তি ও টেকসই পদ্ধতিতে ক্রমাগত বিনিয়োগ করছি, যাতে আমাদের প্রকল্পগুলো আন্তর্জাতিক মান শুধু পূরণই নয়, ছাড়িয়ে যায়। ঐতিহ্যবাহী স্থাপনার সংস্কার থেকে আধুনিক স্থাপত্যের বিস্ময়—আমাদের অভিযোজন ক্ষমতা ও বিস্তৃত দক্ষতা বিচিত্র চ্যালেঞ্জ মোকাবিলায় সক্ষম করে। সামনে এগিয়ে যেতে আমরা পুনর্ব্যক্ত করছি—শুধু স্থাপনা নয়, প্রজন্মের জন্য আরও শক্তিশালী ও সমৃদ্ধ বাংলাদেশ গড়ার অঙ্গীকার। লিটন স্টিলের ওপর আপনার আস্থার জন্য ধন্যবাদ—একসঙ্গে আমরা দেশের ভবিষ্যৎ নির্মাণ করছি।",
  },
};

export const MD = {
  heading: { en: "MESSAGE<br>FROM MD", bn: "এমডি-র<br>বার্তা" },
  name: { en: "Abu Miraj Rudro", bn: "আবু মিরাজ রুদ্র" },
  role: { en: "Managing Director", bn: "ব্যবস্থাপনা পরিচালক" },
  p1: {
    en: "Liton Steel's 35-year history in Bangladesh's building business is something I, as MD, am very proud of. We started out small, but now we're a market leader in engineering, civil, foundation, real estate development, and contracting services. Our brilliant staff, our loyal customers, and our relentless pursuit of excellence and new ideas are the foundation upon which our success rests. Over the years, we have moulded cityscapes, fortified infrastructure, and played a part in the dynamic expansion of our country.",
    bn: "বাংলাদেশের নির্মাণ ব্যবসায় লিটন স্টিলের ৩৫ বছরের ইতিহাস নিয়ে ব্যবস্থাপনা পরিচালক হিসেবে আমি অত্যন্ত গর্বিত। ছোট পরিসরে শুরু করে আজ আমরা প্রকৌশল, সিভিল, ফাউন্ডেশন, রিয়েল এস্টেট উন্নয়ন ও কন্ট্রাক্টিং সেবায় বাজারের শীর্ষস্থানীয় প্রতিষ্ঠান। আমাদের দক্ষ কর্মীবাহিনী, বিশ্বস্ত গ্রাহক এবং উৎকর্ষ ও নতুন ভাবনার নিরলস সাধনাই আমাদের সাফল্যের ভিত্তি। বছরের পর বছর ধরে আমরা নগরের রূপ গড়েছি, অবকাঠামো সুদৃঢ় করেছি এবং দেশের গতিশীল সম্প্রসারণে ভূমিকা রেখেছি।",
  },
  p2: {
    en: "Liton Steel is committed to continuing to innovate and be the industry leader as we look forward to the future. To make sure our initiatives not only live up to but also surpass expectations set by global standards, we keep pouring money into innovative technology and eco-friendly procedures. Restoration of historic structures as well as cutting-edge architectural wonders are both within our capabilities, thanks to our versatility and extensive knowledge. Our dedication to creating a better, more secure Bangladesh for future generations is unwavering as we go on with our plans. We appreciate your confidence in Liton Steel and the fact that we are building Bangladesh's future together.",
    bn: "ভবিষ্যতের দিকে তাকিয়ে লিটন স্টিল উদ্ভাবন অব্যাহত রাখতে ও শিল্পের নেতৃত্ব ধরে রাখতে প্রতিশ্রুতিবদ্ধ। আমাদের উদ্যোগগুলো যেন বৈশ্বিক মানদণ্ড শুধু পূরণ নয়, ছাড়িয়ে যায়—সে লক্ষ্যে আমরা উদ্ভাবনী প্রযুক্তি ও পরিবেশবান্ধব পদ্ধতিতে ক্রমাগত বিনিয়োগ করছি। বহুমুখী দক্ষতা ও বিস্তৃত জ্ঞানের কারণে ঐতিহাসিক স্থাপনার সংস্কার থেকে অত্যাধুনিক স্থাপত্য—দুটোই আমাদের সামর্থ্যের মধ্যে। আগামী প্রজন্মের জন্য আরও উন্নত ও নিরাপদ বাংলাদেশ গড়ার প্রতি আমাদের নিষ্ঠা অটুট। লিটন স্টিলের ওপর আপনার আস্থার জন্য কৃতজ্ঞতা—আমরা একসঙ্গে বাংলাদেশের ভবিষ্যৎ নির্মাণ করছি।",
  },
};

export const VISION = {
  heading: { en: "VISION &<br>MISSION", bn: "ভিশন ও<br>মিশন" },
  visionTitle: { en: "Vision", bn: "ভিশন" },
  vision: {
    en: "To be the foremost pioneer in Bangladesh's construction industry, setting unparalleled standards of excellence and innovation while shaping a sustainable and prosperous future for our nation.",
    bn: "বাংলাদেশের নির্মাণ শিল্পে অগ্রণী পথিকৃৎ হওয়া—উৎকর্ষ ও উদ্ভাবনের অতুলনীয় মানদণ্ড স্থাপন করে দেশের জন্য একটি টেকসই ও সমৃদ্ধ ভবিষ্যৎ গড়ে তোলা।",
  },
  missionTitle: { en: "Mission", bn: "মিশন" },
  mission: {
    en: "At Liton Steel, we are dedicated to transforming Bangladesh's landscape through superior construction solutions. We deliver comprehensive, high-quality services in engineering construction, foundation work, civil construction, real estate development, and contracting. By embracing innovation, nurturing skilled professionals, and adapting to diverse project needs, we contribute to our nation's development with enduring structures and infrastructure. We uphold the highest standards of integrity and client satisfaction while prioritizing sustainable practices. Our goal is not just to construct buildings, but to build a stronger, more vibrant Bangladesh, leaving a lasting legacy of excellence in the construction industry.",
    bn: "লিটন স্টিলে আমরা উন্নত নির্মাণ সমাধানের মাধ্যমে বাংলাদেশের রূপ বদলে দিতে নিবেদিত। প্রকৌশল নির্মাণ, ফাউন্ডেশন কাজ, সিভিল নির্মাণ, রিয়েল এস্টেট উন্নয়ন ও কন্ট্রাক্টিংয়ে আমরা বিস্তৃত ও উচ্চমানের সেবা দিই। উদ্ভাবনকে আলিঙ্গন করে, দক্ষ পেশাজীবী গড়ে তুলে এবং বিচিত্র প্রকল্পের চাহিদার সঙ্গে খাপ খাইয়ে আমরা টেকসই স্থাপনা ও অবকাঠামো দিয়ে জাতীয় উন্নয়নে অবদান রাখি। টেকসই চর্চাকে অগ্রাধিকার দিয়ে আমরা সততা ও গ্রাহক সন্তুষ্টির সর্বোচ্চ মান বজায় রাখি। আমাদের লক্ষ্য শুধু ভবন নির্মাণ নয়—নির্মাণ শিল্পে উৎকর্ষের স্থায়ী ঐতিহ্য রেখে আরও শক্তিশালী, প্রাণবন্ত বাংলাদেশ গড়া।",
  },
};

export const MILESTONE = {
  heading: { en: "MILESTONE", bn: "মাইলফলক" },
  p1: {
    en: "At Liton Steel, we take pride in our remarkable journey of success and innovation over the past 35 years. Our portfolio showcases a diverse range of multi-million dollar construction projects that stand as testaments to our versatility and expertise in the field. We have successfully completed numerous steel and RCC buildings, transforming skylines and creating functional spaces for various purposes. Our capabilities extend beyond traditional structures, as evidenced by our successful construction of specialized facilities such as helipads, demonstrating our ability to meet unique and challenging requirements.",
    bn: "লিটন স্টিলে আমরা গত ৩৫ বছরের সাফল্য ও উদ্ভাবনের অসাধারণ যাত্রায় গর্বিত। আমাদের পোর্টফোলিওতে রয়েছে বহু মিলিয়ন ডলারের বৈচিত্র্যময় নির্মাণ প্রকল্প, যা এই খাতে আমাদের বহুমুখিতা ও দক্ষতার সাক্ষ্য বহন করে। আমরা সফলভাবে অসংখ্য স্টিল ও আরসিসি ভবন নির্মাণ করেছি—স্কাইলাইন বদলে দিয়ে নানা প্রয়োজনে কার্যকর স্থান তৈরি করেছি। প্রচলিত স্থাপনার বাইরেও হেলিপ্যাডের মতো বিশেষায়িত স্থাপনা সফলভাবে নির্মাণ করে আমরা অনন্য ও চ্যালেঞ্জিং চাহিদা পূরণের সক্ষমতা প্রমাণ করেছি।",
  },
  p2: {
    en: "In the realm of recreational and sports facilities, we have excelled in creating state-of-the-art badminton courts and swimming pools, contributing to the development of sports infrastructure in Bangladesh. Our expertise also encompasses vital urban development projects, including the construction of roads that enhance connectivity and mobility. We have further enriched communities by designing and building beautiful gardens and versatile playing fields, showcasing our commitment to creating holistic living environments. This wide array of successfully completed projects underscores our versatility and reinforces our position as a leading force in Bangladesh's construction industry, capable of delivering excellence across diverse project types and scales.",
    bn: "বিনোদন ও ক্রীড়া স্থাপনার ক্ষেত্রে আমরা অত্যাধুনিক ব্যাডমিন্টন কোর্ট ও সুইমিং পুল নির্মাণে দক্ষতা দেখিয়েছি, যা বাংলাদেশের ক্রীড়া অবকাঠামো উন্নয়নে অবদান রেখেছে। সংযোগ ও চলাচল বাড়ানো সড়ক নির্মাণসহ গুরুত্বপূর্ণ নগর উন্নয়ন প্রকল্পেও আমাদের দক্ষতা বিস্তৃত। সুন্দর বাগান ও বহুমুখী খেলার মাঠ নকশা ও নির্মাণের মাধ্যমে আমরা সমাজকে আরও সমৃদ্ধ করেছি—যা সামগ্রিক জীবনযাপনের পরিবেশ তৈরিতে আমাদের অঙ্গীকারের প্রতিফলন। সফলভাবে সম্পন্ন প্রকল্পের এই বিস্তৃত পরিসর আমাদের বহুমুখিতার প্রমাণ এবং বাংলাদেশের নির্মাণ শিল্পে অগ্রণী শক্তি হিসেবে আমাদের অবস্থান সুদৃঢ় করে।",
  },
  clientsTitle: { en: "Our valuable clients", bn: "আমাদের সম্মানিত গ্রাহকবৃন্দ" },
  clients: [
    { en: "British American Tobacco Bangladesh Ltd.", bn: "ব্রিটিশ আমেরিকান টোব্যাকো বাংলাদেশ লিমিটেড" },
    { en: "M.A. Matin Cotton Mill, Sirajganj", bn: "এম.এ. মতিন কটন মিল, সিরাজগঞ্জ" },
    { en: "United Dhaka Tobacco & Kushtia Tobacco Ltd.", bn: "ইউনাইটেড ঢাকা টোব্যাকো ও কুষ্টিয়া টোব্যাকো লিমিটেড" },
    { en: "BRB Cable, Kushtia", bn: "বিআরবি ক্যাবল, কুষ্টিয়া" },
    { en: "General Pharmaceuticals, Gazipur", bn: "জেনারেল ফার্মাসিউটিক্যালস, গাজীপুর" },
    { en: "Ishrak Spinning Mill, Gazipur", bn: "ইশরাক স্পিনিং মিল, গাজীপুর" },
    { en: "Modern Plywood, Kushtia", bn: "মডার্ন প্লাইউড, কুষ্টিয়া" },
    { en: "Chattogram Port Authority", bn: "চট্টগ্রাম বন্দর কর্তৃপক্ষ" },
    { en: "Mumanu Polyester Industries Ltd., Manikganj", bn: "মুমানু পলিয়েস্টার ইন্ডাস্ট্রিজ লিমিটেড, মানিকগঞ্জ" },
    { en: "Molik Group, Ishwardi, Pabna", bn: "মালিক গ্রুপ, ঈশ্বরদী, পাবনা" },
  ],
};

export const SERVICE = {
  heading: { en: "OUR<br>SERVICE", bn: "আমাদের<br>সেবা" },
  intro: {
    en: "At Liton Steel, we offer a comprehensive range of construction services that cater to diverse needs across Bangladesh's evolving landscape. Our 35 years of experience have honed our expertise in delivering high-quality, innovative solutions for projects of all scales. From towering steel structures to intricate recreational facilities, our services encompass the full spectrum of modern construction demands.",
    bn: "লিটন স্টিলে আমরা বাংলাদেশের পরিবর্তনশীল প্রেক্ষাপটে বিচিত্র চাহিদা পূরণে বিস্তৃত নির্মাণ সেবা দিয়ে থাকি। ৩৫ বছরের অভিজ্ঞতা আমাদের সব আকারের প্রকল্পে উচ্চমানের, উদ্ভাবনী সমাধান দেওয়ার দক্ষতা শাণিত করেছে। সুউচ্চ স্টিল স্ট্রাকচার থেকে সূক্ষ্ম বিনোদন স্থাপনা—আধুনিক নির্মাণের সম্পূর্ণ পরিসর আমাদের সেবার আওতায়।",
  },
  individualTitle: { en: "Individual", bn: "ব্যক্তিগত" },
  individual: {
    en: "Our service portfolio includes the construction of steel and RCC buildings, providing robust and efficient structures for various purposes. We specialize in creating unique facilities such as helipads, showcasing our ability to meet specialized requirements. Our expertise extends to sports and leisure facilities, including badminton courts and swimming pools, as well as essential infrastructure like roads. We also excel in landscaping projects, designing and constructing gardens and playing fields that enhance community spaces.",
    bn: "আমাদের সেবার মধ্যে রয়েছে বিভিন্ন প্রয়োজনে মজবুত ও দক্ষ স্টিল ও আরসিসি ভবন নির্মাণ। হেলিপ্যাডের মতো অনন্য স্থাপনা নির্মাণে আমরা বিশেষজ্ঞ, যা বিশেষায়িত চাহিদা পূরণের সক্ষমতা তুলে ধরে। ব্যাডমিন্টন কোর্ট ও সুইমিং পুলসহ ক্রীড়া ও অবসর স্থাপনা এবং সড়কের মতো অপরিহার্য অবকাঠামোতেও আমাদের দক্ষতা বিস্তৃত। বাগান ও খেলার মাঠের নকশা ও নির্মাণে—ল্যান্ডস্কেপিং প্রকল্পেও আমরা পারদর্শী।",
  },
  companyTitle: { en: "Company", bn: "প্রাতিষ্ঠানিক" },
  company: {
    en: "As a company, Liton Steel approaches each project with a commitment to excellence and versatility. We leverage our multi-disciplinary team to provide end-to-end solutions, from initial design to final construction. Our focus on innovation ensures that we incorporate the latest technologies and sustainable practices in all our services. Whether it's a large-scale commercial development or a community recreational facility, we bring the same level of dedication and expertise, always aiming to exceed client expectations and contribute positively to Bangladesh's built environment.",
    bn: "একটি প্রতিষ্ঠান হিসেবে লিটন স্টিল প্রতিটি প্রকল্পে উৎকর্ষ ও বহুমুখিতার অঙ্গীকার নিয়ে কাজ করে। প্রাথমিক নকশা থেকে চূড়ান্ত নির্মাণ পর্যন্ত সম্পূর্ণ সমাধান দিতে আমরা বহুমুখী দক্ষতার টিম কাজে লাগাই। উদ্ভাবনে মনোযোগের ফলে আমাদের সব সেবায় সর্বাধুনিক প্রযুক্তি ও টেকসই পদ্ধতি যুক্ত হয়। বৃহৎ বাণিজ্যিক উন্নয়ন হোক বা কমিউনিটি বিনোদন কেন্দ্র—আমরা একই নিষ্ঠা ও দক্ষতা নিয়ে কাজ করি, সবসময় গ্রাহকের প্রত্যাশা ছাড়িয়ে যাওয়ার এবং বাংলাদেশের নির্মিত পরিবেশে ইতিবাচক অবদান রাখার লক্ষ্যে।",
  },
};

export const PROCESS = {
  heading: { en: "THE<br>PROCESS", bn: "কার্য-<br>প্রণালী" },
  sub: { en: "Process", bn: "প্রক্রিয়া" },
  intro: {
    en: "At Liton Steel, our construction process is a carefully orchestrated journey from concept to completion, ensuring excellence at every stage. Our approach combines 35 years of industry experience with cutting-edge technology and sustainable practices to deliver outstanding results. Here's an overview of our process:",
    bn: "লিটন স্টিলে আমাদের নির্মাণ প্রক্রিয়া ধারণা থেকে সমাপ্তি পর্যন্ত এক সুপরিকল্পিত যাত্রা, যা প্রতিটি ধাপে উৎকর্ষ নিশ্চিত করে। ৩৫ বছরের অভিজ্ঞতার সঙ্গে অত্যাধুনিক প্রযুক্তি ও টেকসই পদ্ধতির সমন্বয়ে আমরা অসাধারণ ফলাফল দিই। আমাদের প্রক্রিয়ার সংক্ষিপ্ত রূপরেখা:",
  },
  steps: [
    { title: { en: "Initial Consultation", bn: "প্রাথমিক পরামর্শ" }, text: { en: "We listen to your needs, survey the site and define scope, budget and timeline together.", bn: "আপনার চাহিদা শুনে, সাইট জরিপ করে পরিধি, বাজেট ও সময়সীমা একসঙ্গে নির্ধারণ করি।" } },
    { title: { en: "Planning & Design", bn: "পরিকল্পনা ও নকশা" }, text: { en: "Our engineers and architects prepare structural designs, drawings and bills of quantity for approval.", bn: "আমাদের প্রকৌশলী ও স্থপতিরা অনুমোদনের জন্য স্ট্রাকচারাল নকশা, ড্রয়িং ও বিওকিউ প্রস্তুত করেন।" } },
    { title: { en: "Resource Allocation", bn: "সম্পদ বরাদ্দ" }, text: { en: "Materials, machinery and skilled crews are scheduled so work starts without delay.", bn: "উপকরণ, যন্ত্রপাতি ও দক্ষ কর্মীদল এমনভাবে বরাদ্দ করা হয় যেন কাজ বিলম্ব ছাড়াই শুরু হয়।" } },
    { title: { en: "Construction Phase", bn: "নির্মাণ পর্যায়" }, text: { en: "Foundation, steel erection and civil works proceed under experienced site management.", bn: "অভিজ্ঞ সাইট ব্যবস্থাপনায় ফাউন্ডেশন, স্টিল স্থাপন ও সিভিল কাজ এগিয়ে চলে।" } },
    { title: { en: "Quality Control", bn: "মান নিয়ন্ত্রণ" }, text: { en: "Every stage is inspected against specifications and safety standards before moving on.", bn: "পরবর্তী ধাপে যাওয়ার আগে প্রতিটি পর্যায় স্পেসিফিকেশন ও নিরাপত্তা মান অনুযায়ী পরিদর্শন করা হয়।" } },
    { title: { en: "Client Communication", bn: "গ্রাহক যোগাযোগ" }, text: { en: "Regular progress updates keep you informed and involved in every decision.", bn: "নিয়মিত অগ্রগতির তথ্যে আপনি প্রতিটি সিদ্ধান্তে অবগত ও সম্পৃক্ত থাকেন।" } },
    { title: { en: "Completion & Handover", bn: "সমাপ্তি ও হস্তান্তর" }, text: { en: "Finishing, testing and documentation are completed before formal handover.", bn: "আনুষ্ঠানিক হস্তান্তরের আগে ফিনিশিং, পরীক্ষা ও ডকুমেন্টেশন সম্পন্ন হয়।" } },
    { title: { en: "After-Service Support", bn: "বিক্রয়োত্তর সহায়তা" }, text: { en: "We stay available for maintenance, modifications and future expansion.", bn: "রক্ষণাবেক্ষণ, পরিবর্তন ও ভবিষ্যৎ সম্প্রসারণে আমরা পাশে থাকি।" } },
  ],
  quote: {
    en: "Quality construction begins with vision, thrives on precision, and endures through dedication. Plan meticulously, execute flawlessly, and inspect rigorously. Build not just structures, but legacies that stand the test of time.",
    bn: "মানসম্মত নির্মাণ শুরু হয় দূরদৃষ্টিতে, বিকশিত হয় নিখুঁততায় আর টিকে থাকে নিষ্ঠায়। সূক্ষ্ম পরিকল্পনা, ত্রুটিহীন বাস্তবায়ন ও কঠোর পরিদর্শন। শুধু স্থাপনা নয়, গড়ুন কালজয়ী ঐতিহ্য।",
  },
};

export const GOALS = {
  heading: { en: "OUR<br>GOALS", bn: "আমাদের<br>লক্ষ্য" },
  intro: {
    en: "At Liton Steel, our goal is to lead Bangladesh's architectural and infrastructural advancement. We aim to set industry benchmarks by delivering innovative, sustainable, and high-quality projects that enhance the nation's landscape and improve lives. Through continuous expansion of our expertise and embracing cutting-edge technologies, we strive to exceed client expectations while shaping a more prosperous and sustainable future for Bangladesh.",
    bn: "লিটন স্টিলে আমাদের লক্ষ্য বাংলাদেশের স্থাপত্য ও অবকাঠামোগত অগ্রগতিতে নেতৃত্ব দেওয়া। উদ্ভাবনী, টেকসই ও উচ্চমানের প্রকল্পের মাধ্যমে দেশের রূপ বদলে ও জীবনমান উন্নত করে আমরা শিল্পের মানদণ্ড স্থাপন করতে চাই। দক্ষতার ক্রমাগত সম্প্রসারণ ও অত্যাধুনিক প্রযুক্তি গ্রহণের মাধ্যমে আমরা গ্রাহকের প্রত্যাশা ছাড়িয়ে যেতে এবং বাংলাদেশের জন্য আরও সমৃদ্ধ ও টেকসই ভবিষ্যৎ গড়তে সচেষ্ট।",
  },
  p1Title: { en: "Process 1", bn: "প্রক্রিয়া ১" },
  p1: {
    en: "We consistently invest in the latest construction technologies and methodologies, ensuring our team stays at the forefront of industry advancements. Regular training programs and workshops keep our staff's skills sharp and up-to-date, enabling us to tackle complex projects with confidence and creativity. This process of constant learning and adaptation allows us to push boundaries in construction techniques, sustainability practices, and project efficiency.",
    bn: "আমরা সর্বাধুনিক নির্মাণ প্রযুক্তি ও পদ্ধতিতে ধারাবাহিক বিনিয়োগ করি, যাতে আমাদের টিম শিল্পের অগ্রগতির সামনের সারিতে থাকে। নিয়মিত প্রশিক্ষণ ও কর্মশালা কর্মীদের দক্ষতা শাণিত ও হালনাগাদ রাখে, ফলে জটিল প্রকল্পও আত্মবিশ্বাস ও সৃজনশীলতায় সামলানো যায়। নিরন্তর শেখা ও অভিযোজনের এই প্রক্রিয়া নির্মাণ কৌশল, টেকসই চর্চা ও প্রকল্প দক্ষতায় সীমানা ছাড়িয়ে যেতে আমাদের সক্ষম করে।",
  },
  p2Title: { en: "Process 2", bn: "প্রক্রিয়া ২" },
  p2: {
    en: "We implement a rigorous project management system that prioritizes client satisfaction at every stage. From initial consultation to final handover, we maintain open communication channels with our clients, ensuring their vision is accurately translated into reality. Our meticulous quality control measures, coupled with adherence to strict timelines and budgets, guarantee that each project not only meets but exceeds expectations. This client-focused approach helps us build long-lasting relationships and a strong reputation in the industry.",
    bn: "আমরা একটি কঠোর প্রকল্প ব্যবস্থাপনা পদ্ধতি অনুসরণ করি, যা প্রতিটি ধাপে গ্রাহক সন্তুষ্টিকে অগ্রাধিকার দেয়। প্রাথমিক পরামর্শ থেকে চূড়ান্ত হস্তান্তর পর্যন্ত গ্রাহকের সঙ্গে খোলামেলা যোগাযোগ বজায় রেখে তাঁদের কল্পনাকে নিখুঁতভাবে বাস্তবে রূপ দিই। সূক্ষ্ম মান নিয়ন্ত্রণ এবং কঠোর সময়সীমা ও বাজেট মেনে চলা নিশ্চিত করে যে প্রতিটি প্রকল্প প্রত্যাশা শুধু পূরণ নয়, ছাড়িয়ে যায়। এই গ্রাহককেন্দ্রিক পদ্ধতি দীর্ঘস্থায়ী সম্পর্ক ও শিল্পে সুদৃঢ় সুনাম গড়তে সাহায্য করে।",
  },
};

export const PROJECTS_SECTION = {
  heading: { en: "OUR<br>PROJECT", bn: "আমাদের<br>প্রকল্প" },
  intro: {
    en: "From foundations to finished factories — a selection of steel structures, industrial sheds, warehouses and leisure facilities built by Liton Steel across Bangladesh.",
    bn: "ফাউন্ডেশন থেকে সম্পূর্ণ কারখানা—বাংলাদেশজুড়ে লিটন স্টিলের নির্মিত স্টিল স্ট্রাকচার, ইন্ডাস্ট্রিয়াল শেড, ওয়্যারহাউস ও অবসর স্থাপনার নির্বাচিত সংগ্রহ।",
  },
  more: { en: "See all projects", bn: "সব প্রকল্প দেখুন" },
};

export const ADMIN = {
  heading: { en: "ADMINISTRATIVE<br>PANEL", bn: "প্রশাসনিক<br>পর্ষদ" },
  people: [
    { name: { en: "Abu Hassan Liton", bn: "আবু হাসান লিটন" }, role: { en: "CEO & Founder", bn: "সিইও ও প্রতিষ্ঠাতা" }, media: "ceo-abu-hassan-liton" },
    { name: { en: "Abu Miraj Rudro", bn: "আবু মিরাজ রুদ্র" }, role: { en: "Managing Director", bn: "ব্যবস্থাপনা পরিচালক" }, media: "md-abu-miraj-rudro" },
    { name: { en: "Md Shakeel Ahmed Jalal", bn: "মো. শাকিল আহমেদ জালাল" }, role: { en: "Advisor & Shareholder", bn: "উপদেষ্টা ও শেয়ারহোল্ডার" }, media: "advisor-shakeel-ahmed-jalal" },
    // Role intentionally blank: set it in the editor (Administrative Panel → this card → Content → Role).
    { name: { en: "Ataur Rahaman Methu", bn: "আতাউর রহমান মিঠু" }, role: { en: "", bn: "" }, media: "advisor-ataur-rahaman-methu" },
  ],
  text1: {
    en: "<strong>Abu Hassan Liton</strong> is the honourable CEO of Liton Steel. He founded the company 35 years ago. His son <strong>Abu Miraj Rudro</strong> is the Managing Director, supporting his father with sound policies and forward-looking strategy. <strong>Md Shakeel Ahmed Jalal</strong> is not only Mr Liton's trusted companion but also his advisor and a shareholder of the company — in every situation he stands beside Liton Steel.",
    bn: "<strong>আবু হাসান লিটন</strong> লিটন স্টিলের সম্মানিত সিইও। ৩৫ বছর আগে তিনি এই প্রতিষ্ঠান গড়ে তোলেন। তাঁর ছেলে <strong>আবু মিরাজ রুদ্র</strong> প্রতিষ্ঠানের ব্যবস্থাপনা পরিচালক—অসাধারণ নীতি ও অত্যাধুনিক কৌশল প্রণয়নে তিনি বাবাকে সহায়তা করেন। <strong>মো. শাকিল আহমেদ জালাল</strong> শুধু মি. লিটনের বিশ্বস্ত সহযোগীই নন, প্রতিষ্ঠানের উপদেষ্টা ও শেয়ারহোল্ডারও। যেকোনো পরিস্থিতিতে তিনি লিটন স্টিলের পাশে থাকেন।",
  },
};

export const TEAM = {
  heading: { en: "MEET<br>THE TEAM", bn: "আমাদের<br>টিম" },
  groups: [
    { role: { en: "Operation Manager", bn: "অপারেশন ম্যানেজার" }, members: [{ en: "Mr Sumon", bn: "মি. সুমন" }] },
    { role: { en: "Accounting Manager", bn: "অ্যাকাউন্টিং ম্যানেজার" }, members: [{ en: "Md Shahriyer Parvez", bn: "মো. শাহরিয়ার পারভেজ" }] },
    { role: { en: "Chief Engineer", bn: "চিফ ইঞ্জিনিয়ার" }, members: [{ en: "Engr. Md Rayhanul Islam", bn: "ইঞ্জি. মো. রায়হানুল ইসলাম" }] },
    { role: { en: "Civil Engineer", bn: "সিভিল ইঞ্জিনিয়ার" }, members: [{ en: "Sanwar Hossain", bn: "সানোয়ার হোসেন" }, { en: "Md Somrat Hossain", bn: "মো. সম্রাট হোসেন" }, { en: "Kazi Moniruzzaman", bn: "কাজী মনিরুজ্জামান" }] },
    { role: { en: "Project Manager", bn: "প্রজেক্ট ম্যানেজার" }, members: [{ en: "Shorob Ahmed Shojib", bn: "শরব আহমেদ সজীব" }] },
    { role: { en: "Asst. Project Manager", bn: "সহকারী প্রজেক্ট ম্যানেজার" }, members: [{ en: "Momenur Rahman Shojib", bn: "মোমেনুর রহমান সজীব" }] },
    { role: { en: "Computer Operator", bn: "কম্পিউটার অপারেটর" }, members: [{ en: "Md Rubel Parvez", bn: "মো. রুবেল পারভেজ" }] },
    { role: { en: "Workshop In-charge", bn: "ওয়ার্কশপ ইনচার্জ" }, members: [{ en: "Md Humayun Kabir Aarfy", bn: "মো. হুমায়ুন কবির আরফি" }, { en: "Md Shipon Ahmed", bn: "মো. শিপন আহমেদ" }] },
  ],
};

export const CONTACT = {
  heading: { en: "LET'S<br>CONNECT<br>WITH US", bn: "আসুন<br>যুক্ত হই" },
  text: {
    en: "We and our team are ready to deliver a construction experience you'll be satisfied with. Don't look anywhere else — contract with us.",
    bn: "আমরা ও আমাদের টিম আপনাকে সন্তোষজনক নির্মাণ অভিজ্ঞতা দিতে প্রস্তুত। অন্য কোথাও নয়—আমাদের সঙ্গেই চুক্তি করুন।",
  },
  formTitle: { en: "Send us a message", bn: "আমাদের বার্তা পাঠান" },
};

export const FOOTER = {
  about: { en: "M/S Liton Steel is a steel structure and civil construction company based in Kushtia, Bangladesh, building industrial sheds, warehouses, factories, foundations and leisure facilities since 1990.", bn: "মেসার্স লিটন স্টিল কুষ্টিয়া, বাংলাদেশভিত্তিক একটি স্টিল স্ট্রাকচার ও সিভিল নির্মাণ প্রতিষ্ঠান, যা ১৯৯০ সাল থেকে ইন্ডাস্ট্রিয়াল শেড, ওয়্যারহাউস, কারখানা, ফাউন্ডেশন ও অবসর স্থাপনা নির্মাণ করছে।" },
  note: { en: "Built with steel, gold and a lot of care.", bn: "স্টিল, সোনালি রং আর অনেক যত্নে নির্মিত।" },
};
