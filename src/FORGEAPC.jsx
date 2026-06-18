import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Cpu, CircuitBoard, MemoryStick, HardDrive, Power, Box, Fan, MonitorPlay,
  Gamepad2, Clapperboard, Radio, Boxes, BrainCircuit, Briefcase,
  Sparkles, Save, Plus, Trash2, Check, X, AlertTriangle, ChevronRight,
  ChevronLeft, Zap, DollarSign, RotateCcw, ShieldCheck, ShieldAlert, Repeat2, Wrench, Send, Bot, MessageCircle, Maximize, Minimize, Settings, Sun, Moon, Search, Users, Upload, Globe, Columns2, PackageSearch, LayoutGrid
} from "lucide-react";
import { MEDIA, MEDIA_NE } from "../data/part-media.js";
import { myId as netId, makeCode as netCode, roomChannel as netRoom, lobbyChannel as netLobby, leave as netLeave, signUp as netSignUp, logIn as netLogIn, fetchElo as netFetchElo, fetchUser as netFetchUser, saveElo as netSaveElo, eloGain as netEloGain, leaderboard as netLeaderboard, listBuilds as netListBuilds, syncBuild as netSyncBuild, deleteBuildCloud as netDeleteBuild, allUsers as netAllUsers, deleteUser as netDeleteUser, setElo as netSetElo, resetPassword as netResetPassword, setCustomRank as netSetCustomRank, listCommunityBuilds as netListCommunity, postCommunityBuild as netPostCommunity, deleteCommunityBuild as netDeleteCommunity, countCommunityBuilds as netCountCommunity, submitFeedback as netSubmitFeedback, listFeedback as netListFeedback, deleteFeedback as netDeleteFeedback, recordFactionPoints as netRecordFactionPoints, fetchFactionTotals as netFactionTotals, setFactionPick as netSetFactionPick, applyFactionWeekReward as netApplyFactionWeekReward, recordGauntletScore as netRecordGauntletScore, gauntletLeaderboard as netGauntletLeaderboard, fetchBalance as netFetchBalance, placeBet as netPlaceBet, settleBet as netSettleBet, fetchRoguePerks as netFetchRoguePerks, saveRogueRun as netSaveRogueRun, supabase as netSupabase, fetchProfile as netFetchProfile, saveProfile as netSaveProfile } from "./moggerNet.js";
/* ----------------------------- i18n ----------------------------- */
const LANGS = [{"code": "en", "name": "English"}, {"code": "es", "name": "Español"}, {"code": "zh", "name": "中文"}, {"code": "hi", "name": "हिन्दी"}, {"code": "ar", "name": "العربية"}, {"code": "pt", "name": "Português"}, {"code": "fr", "name": "Français"}, {"code": "ru", "name": "Русский"}, {"code": "ja", "name": "日本語"}, {"code": "de", "name": "Deutsch"}];
const I18N = {"en": {"myRigs": "My Rigs", "settings": "Settings", "appearance": "Appearance", "language": "Language", "theme": "Theme", "dark": "Dark", "light": "Light", "back": "Back", "saveRig": "Save rig", "select": "Select", "selected": "Selected", "moreInfo": "More info", "hideInfo": "Hide info", "autoForge": "Auto-Forge", "buildYourself": "Build It Yourself", "yourBuild": "Your build", "budgetQ": "What's your budget?", "useCaseQ": "What will this PC be for?", "livePrices": "Live prices", "samplePrices": "sample prices", "updated": "updated", "componentsDb": "components in the database", "overBudgetCat": "Over your {x} budget", "performance": "PERFORMANCE", "pricePerf": "PRICE / PERF", "pros": "PROS", "cons": "CONS"}, "es": {"myRigs": "Mis Equipos", "settings": "Ajustes", "appearance": "Apariencia", "language": "Idioma", "theme": "Tema", "dark": "Oscuro", "light": "Claro", "back": "Atrás", "saveRig": "Guardar", "select": "Elegir", "selected": "Elegido", "moreInfo": "Más info", "hideInfo": "Ocultar", "autoForge": "Auto-Forjar", "buildYourself": "Hazlo tú mismo", "yourBuild": "Tu equipo", "budgetQ": "¿Cuál es tu presupuesto?", "useCaseQ": "¿Para qué será este PC?", "livePrices": "Precios en vivo", "samplePrices": "precios de muestra", "updated": "actualizado", "componentsDb": "componentes en la base de datos", "overBudgetCat": "Supera tu presupuesto de {x}", "performance": "RENDIMIENTO", "pricePerf": "PRECIO / REND", "pros": "PROS", "cons": "CONTRAS"}, "zh": {"myRigs": "我的配置", "settings": "设置", "appearance": "外观", "language": "语言", "theme": "主题", "dark": "深色", "light": "浅色", "back": "返回", "saveRig": "保存配置", "select": "选择", "selected": "已选", "moreInfo": "更多信息", "hideInfo": "隐藏", "autoForge": "自动配置", "buildYourself": "自己组装", "yourBuild": "你的配置", "budgetQ": "你的预算是多少？", "useCaseQ": "这台电脑用来做什么？", "livePrices": "实时价格", "samplePrices": "示例价格", "updated": "更新于", "componentsDb": "个组件已入库", "overBudgetCat": "超出{x}预算", "performance": "性能", "pricePerf": "性价比", "pros": "优点", "cons": "缺点"}, "hi": {"myRigs": "मेरे रिग", "settings": "सेटिंग्स", "appearance": "रूप", "language": "भाषा", "theme": "थीम", "dark": "गहरा", "light": "हल्का", "back": "वापस", "saveRig": "सहेजें", "select": "चुनें", "selected": "चयनित", "moreInfo": "और जानकारी", "hideInfo": "छिपाएं", "autoForge": "ऑटो-फोर्ज", "buildYourself": "खुद बनाएं", "yourBuild": "आपका बिल्ड", "budgetQ": "आपका बजट क्या है?", "useCaseQ": "यह पीसी किसलिए होगा?", "livePrices": "लाइव कीमतें", "samplePrices": "नमूना कीमतें", "updated": "अपडेट", "componentsDb": "घटक डेटाबेस में", "overBudgetCat": "{x} बजट से अधिक", "performance": "प्रदर्शन", "pricePerf": "मूल्य/प्रदर्शन", "pros": "फायदे", "cons": "नुकसान"}, "ar": {"myRigs": "أجهزتي", "settings": "الإعدادات", "appearance": "المظهر", "language": "اللغة", "theme": "السمة", "dark": "داكن", "light": "فاتح", "back": "رجوع", "saveRig": "حفظ", "select": "اختيار", "selected": "محدد", "moreInfo": "المزيد", "hideInfo": "إخفاء", "autoForge": "تجميع تلقائي", "buildYourself": "اصنعه بنفسك", "yourBuild": "تجميعتك", "budgetQ": "ما هي ميزانيتك؟", "useCaseQ": "لأي غرض هذا الحاسوب؟", "livePrices": "أسعار حية", "samplePrices": "أسعار تجريبية", "updated": "محدّث", "componentsDb": "مكوّن في قاعدة البيانات", "overBudgetCat": "يتجاوز ميزانية {x}", "performance": "الأداء", "pricePerf": "السعر/الأداء", "pros": "الإيجابيات", "cons": "السلبيات"}, "pt": {"myRigs": "Meus PCs", "settings": "Configurações", "appearance": "Aparência", "language": "Idioma", "theme": "Tema", "dark": "Escuro", "light": "Claro", "back": "Voltar", "saveRig": "Salvar", "select": "Selecionar", "selected": "Selecionado", "moreInfo": "Mais info", "hideInfo": "Ocultar", "autoForge": "Auto-Forjar", "buildYourself": "Faça você mesmo", "yourBuild": "Sua build", "budgetQ": "Qual é o seu orçamento?", "useCaseQ": "Para que será este PC?", "livePrices": "Preços ao vivo", "samplePrices": "preços de exemplo", "updated": "atualizado", "componentsDb": "componentes no banco de dados", "overBudgetCat": "Acima do orçamento de {x}", "performance": "DESEMPENHO", "pricePerf": "PREÇO / DESEMP", "pros": "PRÓS", "cons": "CONTRAS"}, "fr": {"myRigs": "Mes Configs", "settings": "Réglages", "appearance": "Apparence", "language": "Langue", "theme": "Thème", "dark": "Sombre", "light": "Clair", "back": "Retour", "saveRig": "Enregistrer", "select": "Choisir", "selected": "Choisi", "moreInfo": "Plus d'infos", "hideInfo": "Masquer", "autoForge": "Auto-Forge", "buildYourself": "Faites-le vous-même", "yourBuild": "Votre config", "budgetQ": "Quel est votre budget ?", "useCaseQ": "À quoi servira ce PC ?", "livePrices": "Prix en direct", "samplePrices": "prix indicatifs", "updated": "mis à jour", "componentsDb": "composants dans la base", "overBudgetCat": "Au-dessus du budget {x}", "performance": "PERFORMANCE", "pricePerf": "PRIX / PERF", "pros": "ATOUTS", "cons": "INCONVÉNIENTS"}, "ru": {"myRigs": "Мои сборки", "settings": "Настройки", "appearance": "Вид", "language": "Язык", "theme": "Тема", "dark": "Тёмная", "light": "Светлая", "back": "Назад", "saveRig": "Сохранить", "select": "Выбрать", "selected": "Выбрано", "moreInfo": "Подробнее", "hideInfo": "Скрыть", "autoForge": "Авто-сборка", "buildYourself": "Собрать самому", "yourBuild": "Ваша сборка", "budgetQ": "Каков ваш бюджет?", "useCaseQ": "Для чего этот ПК?", "livePrices": "Цены в реальном времени", "samplePrices": "примерные цены", "updated": "обновлено", "componentsDb": "компонентов в базе", "overBudgetCat": "Сверх бюджета на {x}", "performance": "ПРОИЗВОДИТ.", "pricePerf": "ЦЕНА/КАЧ.", "pros": "ПЛЮСЫ", "cons": "МИНУСЫ"}, "ja": {"myRigs": "マイ構成", "settings": "設定", "appearance": "外観", "language": "言語", "theme": "テーマ", "dark": "ダーク", "light": "ライト", "back": "戻る", "saveRig": "保存", "select": "選択", "selected": "選択済", "moreInfo": "詳細", "hideInfo": "隠す", "autoForge": "自動構成", "buildYourself": "自分で組む", "yourBuild": "あなたの構成", "budgetQ": "予算はいくらですか？", "useCaseQ": "このPCの用途は？", "livePrices": "ライブ価格", "samplePrices": "サンプル価格", "updated": "更新", "componentsDb": "個のパーツを収録", "overBudgetCat": "{x}予算オーバー", "performance": "性能", "pricePerf": "価格性能", "pros": "長所", "cons": "短所"}, "de": {"myRigs": "Meine Builds", "settings": "Einstellungen", "appearance": "Darstellung", "language": "Sprache", "theme": "Thema", "dark": "Dunkel", "light": "Hell", "back": "Zurück", "saveRig": "Speichern", "select": "Wählen", "selected": "Gewählt", "moreInfo": "Mehr Info", "hideInfo": "Verbergen", "autoForge": "Auto-Forge", "buildYourself": "Selbst bauen", "yourBuild": "Dein Build", "budgetQ": "Wie hoch ist dein Budget?", "useCaseQ": "Wofür ist dieser PC?", "livePrices": "Live-Preise", "samplePrices": "Beispielpreise", "updated": "aktualisiert", "componentsDb": "Komponenten in der Datenbank", "overBudgetCat": "Über dem {x}-Budget", "performance": "LEISTUNG", "pricePerf": "PREIS / LEIST", "pros": "VORTEILE", "cons": "NACHTEILE"}};
let CUR_LANG = "en";

const I18N_X = {"en": {"budget": "budget", "startBuild": "Start a new build", "savedWord": "saved", "loadingRigs": "Loading your rigs…", "noRigs": "No rigs yet. Build one and save it here.", "chooseA": "CHOOSE A", "outOfStock": "Out of stock"}, "es": {"budget": "presupuesto", "startBuild": "Crear nueva build", "savedWord": "guardados", "loadingRigs": "Cargando tus equipos…", "noRigs": "Aún no hay equipos. Crea uno y guárdalo aquí.", "chooseA": "ELIGE", "outOfStock": "Agotado"}, "zh": {"budget": "预算", "startBuild": "开始新配置", "savedWord": "已保存", "loadingRigs": "正在加载…", "noRigs": "还没有配置。创建并保存在这里。", "chooseA": "选择", "outOfStock": "缺货"}, "hi": {"budget": "बजट", "startBuild": "नया बिल्ड शुरू करें", "savedWord": "सहेजे गए", "loadingRigs": "आपके रिग लोड हो रहे हैं…", "noRigs": "अभी कोई रिग नहीं। एक बनाएं और सहेजें।", "chooseA": "चुनें", "outOfStock": "स्टॉक ख़त्म"}, "ar": {"budget": "ميزانية", "startBuild": "ابدأ بناءً جديدًا", "savedWord": "محفوظ", "loadingRigs": "جارٍ التحميل…", "noRigs": "لا أجهزة بعد. أنشئ واحداً واحفظه هنا.", "chooseA": "اختر", "outOfStock": "نفد المخزون"}, "pt": {"budget": "orçamento", "startBuild": "Iniciar nova build", "savedWord": "salvos", "loadingRigs": "Carregando…", "noRigs": "Nenhum PC ainda. Crie e salve aqui.", "chooseA": "ESCOLHA", "outOfStock": "Esgotado"}, "fr": {"budget": "budget", "startBuild": "Nouvelle config", "savedWord": "enregistrés", "loadingRigs": "Chargement…", "noRigs": "Aucune config. Créez-en une et enregistrez-la.", "chooseA": "CHOISIR", "outOfStock": "Rupture de stock"}, "ru": {"budget": "бюджет", "startBuild": "Новая сборка", "savedWord": "сохранено", "loadingRigs": "Загрузка…", "noRigs": "Сборок пока нет. Создайте и сохраните.", "chooseA": "ВЫБЕРИТЕ", "outOfStock": "Нет в наличии"}, "ja": {"budget": "予算", "startBuild": "新しい構成を始める", "savedWord": "保存済み", "loadingRigs": "読み込み中…", "noRigs": "まだ構成がありません。作成して保存しましょう。", "chooseA": "選択", "outOfStock": "在庫切れ"}, "de": {"budget": "Budget", "startBuild": "Neuen Build starten", "savedWord": "gespeichert", "loadingRigs": "Wird geladen…", "noRigs": "Noch keine Builds. Erstelle und speichere einen.", "chooseA": "WÄHLE", "outOfStock": "Nicht verfügbar"}};
const _UCL = {"en": {"gaming": "Gaming", "content": "Content Creation", "streaming": "Streaming", "workstation": "3D / Workstation", "ai": "AI / ML", "office": "Office / Everyday"}, "es": {"gaming": "Juegos", "content": "Creación de Contenido", "streaming": "Streaming", "workstation": "3D / Estación", "ai": "IA / ML", "office": "Oficina / Diario"}, "zh": {"gaming": "游戏", "content": "内容创作", "streaming": "直播", "workstation": "3D 工作站", "ai": "AI / 机器学习", "office": "办公 / 日常"}, "hi": {"gaming": "गेमिंग", "content": "कंटेंट क्रिएशन", "streaming": "स्ट्रीमिंग", "workstation": "3D / वर्कस्टेशन", "ai": "एआई / एमएल", "office": "ऑफिस / रोज़"}, "ar": {"gaming": "الألعاب", "content": "صناعة المحتوى", "streaming": "البث", "workstation": "3D / محطة عمل", "ai": "ذكاء اصطناعي", "office": "مكتب / يومي"}, "pt": {"gaming": "Jogos", "content": "Criação de Conteúdo", "streaming": "Streaming", "workstation": "3D / Workstation", "ai": "IA / ML", "office": "Escritório / Diário"}, "fr": {"gaming": "Jeux", "content": "Création de Contenu", "streaming": "Streaming", "workstation": "3D / Station", "ai": "IA / ML", "office": "Bureau / Quotidien"}, "ru": {"gaming": "Игры", "content": "Контент", "streaming": "Стриминг", "workstation": "3D / Рабочая станция", "ai": "ИИ / МО", "office": "Офис / Повседневный"}, "ja": {"gaming": "ゲーム", "content": "コンテンツ制作", "streaming": "配信", "workstation": "3D / ワークステーション", "ai": "AI / ML", "office": "オフィス / 日常"}, "de": {"gaming": "Gaming", "content": "Content-Erstellung", "streaming": "Streaming", "workstation": "3D / Workstation", "ai": "KI / ML", "office": "Büro / Alltag"}};
const _UCT = {"en": {"gaming": "Max FPS", "content": "Video & Photo", "streaming": "Play & Broadcast", "workstation": "Render & CAD", "ai": "VRAM Hungry", "office": "Snappy & Cheap"}, "es": {"gaming": "Máx FPS", "content": "Vídeo y Foto", "streaming": "Jugar y Transmitir", "workstation": "Renderizado y CAD", "ai": "Hambriento de VRAM", "office": "Rápido y Barato"}, "zh": {"gaming": "最高帧率", "content": "视频与照片", "streaming": "边玩边播", "workstation": "渲染与CAD", "ai": "显存需求高", "office": "流畅又便宜"}, "hi": {"gaming": "अधिकतम FPS", "content": "वीडियो और फोटो", "streaming": "खेलें और प्रसारित करें", "workstation": "रेंडर और CAD", "ai": "अधिक VRAM", "office": "तेज़ और सस्ता"}, "ar": {"gaming": "أقصى إطارات", "content": "فيديو وصور", "streaming": "لعب وبث", "workstation": "تصيير وCAD", "ai": "نهم للذاكرة", "office": "سريع ورخيص"}, "pt": {"gaming": "Máx FPS", "content": "Vídeo e Foto", "streaming": "Jogar e Transmitir", "workstation": "Renderização e CAD", "ai": "Faminto por VRAM", "office": "Rápido e Barato"}, "fr": {"gaming": "FPS max", "content": "Vidéo & Photo", "streaming": "Jouer & Diffuser", "workstation": "Rendu & CAO", "ai": "Gourmand en VRAM", "office": "Rapide & Abordable"}, "ru": {"gaming": "Макс FPS", "content": "Видео и фото", "streaming": "Игра и трансляция", "workstation": "Рендер и CAD", "ai": "Нужен VRAM", "office": "Быстро и дёшево"}, "ja": {"gaming": "最大FPS", "content": "動画と写真", "streaming": "プレイ＆配信", "workstation": "レンダー＆CAD", "ai": "VRAM大食い", "office": "軽快＆安価"}, "de": {"gaming": "Max FPS", "content": "Video & Foto", "streaming": "Spielen & Senden", "workstation": "Rendern & CAD", "ai": "VRAM-hungrig", "office": "Flott & Günstig"}};
const _CATL = {"en": {"cpu": "CPU", "gpu": "Graphics Card", "mobo": "Motherboard", "ram": "Memory", "storage": "Storage", "psu": "Power Supply", "case": "Case", "cooler": "CPU Cooler"}, "es": {"cpu": "CPU", "gpu": "Tarjeta Gráfica", "mobo": "Placa Base", "ram": "Memoria", "storage": "Almacenamiento", "psu": "Fuente", "case": "Caja", "cooler": "Disipador"}, "zh": {"cpu": "处理器", "gpu": "显卡", "mobo": "主板", "ram": "内存", "storage": "存储", "psu": "电源", "case": "机箱", "cooler": "散热器"}, "hi": {"cpu": "सीपीयू", "gpu": "ग्राफिक्स कार्ड", "mobo": "मदरबोर्ड", "ram": "मेमोरी", "storage": "स्टोरेज", "psu": "बिजली आपूर्ति", "case": "केस", "cooler": "कूलर"}, "ar": {"cpu": "معالج", "gpu": "بطاقة رسومات", "mobo": "اللوحة الأم", "ram": "الذاكرة", "storage": "التخزين", "psu": "مزود الطاقة", "case": "الصندوق", "cooler": "مبرد"}, "pt": {"cpu": "CPU", "gpu": "Placa de Vídeo", "mobo": "Placa-Mãe", "ram": "Memória", "storage": "Armazenamento", "psu": "Fonte", "case": "Gabinete", "cooler": "Cooler"}, "fr": {"cpu": "Processeur", "gpu": "Carte Graphique", "mobo": "Carte Mère", "ram": "Mémoire", "storage": "Stockage", "psu": "Alimentation", "case": "Boîtier", "cooler": "Refroidisseur"}, "ru": {"cpu": "Процессор", "gpu": "Видеокарта", "mobo": "Материнская плата", "ram": "Память", "storage": "Накопитель", "psu": "Блок питания", "case": "Корпус", "cooler": "Охлаждение"}, "ja": {"cpu": "CPU", "gpu": "グラフィックカード", "mobo": "マザーボード", "ram": "メモリ", "storage": "ストレージ", "psu": "電源", "case": "ケース", "cooler": "クーラー"}, "de": {"cpu": "Prozessor", "gpu": "Grafikkarte", "mobo": "Hauptplatine", "ram": "Arbeitsspeicher", "storage": "Speicher", "psu": "Netzteil", "case": "Gehäuse", "cooler": "Kühler"}};
const _pick = (mp, k) => (mp[CUR_LANG] && mp[CUR_LANG][k]) || mp.en[k] || k;
const tUC = (k) => (_UCL[CUR_LANG] && _UCL[CUR_LANG][k]) || _UCL.en[k] || (USE_CASES[k] && USE_CASES[k].label) || k;
const tUCtag = (k) => (_UCT[CUR_LANG] && _UCT[CUR_LANG][k]) || _UCT.en[k] || (USE_CASES[k] && USE_CASES[k].tag) || k;
const tCat = (k) => _pick(_CATL, k);
function t(key, vars) {
  const d = I18N[CUR_LANG] || I18N.en, x = I18N_X[CUR_LANG] || I18N_X.en;
  let str = (d && d[key]) || (x && x[key]) || I18N.en[key] || I18N_X.en[key] || key;
  if (vars) for (const k in vars) str = str.split('{'+k+'}').join(vars[k]);
  return str;
}


// Live-pricing endpoint (your deployed serverless function). When reachable it
// overrides the built-in sample prices; when not (e.g. inside Claude or offline)
// the app silently keeps the sample prices below.
const PRICES_URL = "/api/prices";

/* =========================================================================
   RIGFORGE — PC part picker w/ scoring, compatibility & saved builds
   Mock data stands in for the Best Buy API. Architecture is unchanged:
   a catalog + benchmark layer feeds a deterministic scoring/compat engine;
   the build score uses HYBRID mode (engine computes the number, a verdict
   generator narrates it — swap generateVerdict() for a live Claude call).
   ========================================================================= */

/* ----------------------------- MOCK CATALOG ----------------------------- */
import { CATALOG } from "./data/catalog.js";

const CATEGORY_ORDER = ["cpu", "gpu", "mobo", "ram", "storage", "psu", "case", "cooler"];
const CAT_META = {
  cpu:     { label: "CPU",          Icon: Cpu },
  gpu:     { label: "Graphics Card",Icon: MonitorPlay },
  mobo:    { label: "Motherboard",  Icon: CircuitBoard },
  ram:     { label: "Memory",       Icon: MemoryStick },
  storage: { label: "Storage",      Icon: HardDrive },
  psu:     { label: "Power Supply", Icon: Power },
  case:    { label: "Case",         Icon: Box },
  cooler:  { label: "CPU Cooler",   Icon: Fan },
};

/* The allocation table — the "secret sauce". % of budget per category. */
const USE_CASES = {
  gaming:      { label: "Gaming",          tag: "Max FPS",            Icon: Gamepad2,    alloc: { gpu:34, cpu:16, mobo:8, ram:14, storage:10, psu:7, case:6, cooler:5 } },
  content:     { label: "Content Creation",tag: "Video & Photo",      Icon: Clapperboard,alloc: { gpu:20, cpu:22, mobo:9, ram:22, storage:14, psu:6, case:4, cooler:3 } },
  streaming:   { label: "Streaming",       tag: "Play & Broadcast",   Icon: Radio,       alloc: { gpu:27, cpu:22, mobo:9, ram:18, storage:8, psu:7, case:5, cooler:4 } },
  workstation: { label: "3D / Workstation",tag: "Render & CAD",       Icon: Boxes,       alloc: { gpu:26, cpu:23, mobo:8, ram:22, storage:11, psu:5, case:3, cooler:2 } },
  ai:          { label: "AI / ML",         tag: "VRAM Hungry",        Icon: BrainCircuit,alloc: { gpu:40, cpu:12, mobo:7, ram:20, storage:10, psu:6, case:3, cooler:2 } },
  office:      { label: "Office / Everyday",tag: "Snappy & Cheap",    Icon: Briefcase,   alloc: { gpu:0, cpu:24, mobo:13, ram:26, storage:20, psu:8, case:6, cooler:3 } },
};

// The six selectable use cases (captured before any blended keys are registered).
const BASE_UC_KEYS = Object.keys(USE_CASES);

// Register (and cache) a blended use case from multiple base keys. The blend gets an
// averaged budget allocation and a `blend` list; ucPerf() averages the picks across
// the listed base cases. Returns the single key (real or blended) to use everywhere.
function makeUseCase(keys) {
  keys = (keys || []).filter((k) => BASE_UC_KEYS.includes(k));
  if (keys.length <= 1) return keys[0] || "gaming";
  const key = [...keys].sort().join("+");
  if (!USE_CASES[key]) {
    const alloc = {};
    for (const c of CATEGORY_ORDER) alloc[c] = Math.round(keys.reduce((s, k) => s + (USE_CASES[k].alloc[c] || 0), 0) / keys.length);
    USE_CASES[key] = {
      label: keys.map((k) => USE_CASES[k].label).join(" + "),
      tag: "Multi-purpose",
      Icon: USE_CASES[keys[0]].Icon,
      alloc,
      blend: keys,
    };
  }
  return key;
}
// Re-register a blended key (e.g. from a saved build) if it isn't present yet.
function ensureUseCase(key) {
  if (!key || USE_CASES[key]) return key;
  return key.indexOf("+") >= 0 ? makeUseCase(key.split("+")) : key;
}

const MAX_PERF = Object.fromEntries(
  CATEGORY_ORDER.map((c) => [c, Math.max(...CATALOG[c].map((p) => p.perf))])
);
const CATALOG_COUNT = Object.values(CATALOG).reduce((s, a) => s + a.length, 0);

/* ----------------------------- META SHIFT ALERTS ----------------------------- */
// Snapshot of the single best raw-perf pick and best perf-per-dollar pick in each
// category. Diffed against the last snapshot (localStorage) on load to flag when a
// catalog change (price/perf edit, new part) moved the "optimal" pick.
function catalogTopPicks() {
  const out = {};
  for (const c of CATEGORY_ORDER) {
    const parts = CATALOG[c];
    let bestPerf = parts[0], bestValue = null, bestRatio = -1;
    for (const p of parts) {
      if (p.perf > bestPerf.perf) bestPerf = p;
      if (p.price > 0) { const r = p.perf / p.price; if (r > bestRatio) { bestRatio = r; bestValue = p; } }
    }
    out[c] = { bestPerfId: bestPerf.id, bestPerfName: bestPerf.model || bestPerf.name, bestValueId: bestValue ? bestValue.id : null, bestValueName: bestValue ? (bestValue.model || bestValue.name) : null };
  }
  return out;
}

// Attach product image + link to each part (refreshed live by /api/prices when available).
for (const _c in CATALOG) for (const _p of CATALOG[_c]) { const _m = MEDIA[_p.id]; if (_m) { _p.img = _m.img; _p.url = _m.url; } }

// After MEDIA is attached, fill missing images from sibling variants.
// Pass 1: exact model match (e.g. same GPU model, different variant).
// Pass 2: family match — strips " 16GB DDR4-3600", " 750W", " 360" suffixes so that
//         "G.Skill Ripjaws V 16GB DDR4-3200" reuses "G.Skill Ripjaws V 16GB DDR4-3600" image.
const _famKey = (n) => (n || "").replace(/\s+\d+GB[\w\s-]*$/i, "").replace(/\s+\d+W\s*$/i, "").replace(/\s+\d+\s*$/, "").trim();
for (const _pass of [0, 1]) {
  for (const _c in CATALOG) {
    for (const _p of CATALOG[_c]) {
      if (_p.img) continue;
      const _pKey = _pass === 0 ? (_p.model || _p.name) : _famKey(_p.model || _p.name);
      const _sib = CATALOG[_c].find((s) => {
        if (!s.img || s.id === _p.id) return false;
        const _sKey = _pass === 0 ? (s.model || s.name) : _famKey(s.model || s.name);
        return _sKey === _pKey;
      });
      if (_sib) { _p.img = _sib.img; _p.url = _sib.url; }
    }
  }
}

let PRICE_LIVE = false; // set true once live pricing has loaded
const partOOS = (p) => PRICE_LIVE && p && p._live === false; // out of stock = no live price
const fmt = (n) => "$" + (Number.isInteger(Number(n)) ? Number(n).toLocaleString() : Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* ----------------------------- SCORING ----------------------------- */
// Use-case-aware performance: the same part is worth more or less depending on
// what you're building for. Gaming leans on the base (gaming-weighted) score;
// productivity rewards CPU cores; AI/content reward GPU VRAM; workstation/AI/
// content reward RAM & storage capacity; gaming treats 32GB RAM as the sweet spot.
function ucPerf(cat, part, uc) {
  const U = USE_CASES[uc];
  if (U && U.blend) { // blended use case: average the picks across its base cases
    let s = 0; for (const k of U.blend) s += ucPerf(cat, part, k); return s / U.blend.length;
  }
  const heavyRam = uc === "workstation" || uc === "ai" || uc === "content";
  switch (cat) {
    case "cpu":
      // content/workstation/ai: multicore rendering/encode/inference — reward cores heavily
      if (uc === "content" || uc === "workstation" || uc === "ai")
        return part.perf * 0.6 + (Math.min(part.cores, 16) / 16) * 100 * 0.4;
      // gaming: large-cache X3D chips punch far above their base rating —
      // a 7600X3D out-games a Core Ultra 5 / non-X3D Ryzen despite a lower MT score.
      // X3D cache does NOT help streaming (encoding is multicore/NVENC, not cache-sensitive).
      if (uc === "gaming" && /X3D/i.test(part.name || part.model || ""))
        return part.perf + 10;
      // streaming: OBS encoding is heavily multicore — reward core count alongside raw perf.
      // X3D cache still helps the gaming side of streaming, so give a small bonus.
      if (uc === "streaming") {
        const x3dBonus = /X3D/i.test(part.name || part.model || "") ? 5 : 0;
        return part.perf * 0.65 + (Math.min(part.cores || 8, 16) / 16) * 100 * 0.35 + x3dBonus;
      }
      // office: strong multi-core for multitasking/compilation; no artificial perf cap
      if (uc === "office")
        return part.perf * 0.6 + (Math.min(part.cores || 4, 16) / 16) * 100 * 0.4;
      return part.perf;
    case "gpu":
      // office: 16GB VRAM minimum recommended for productivity/AI workloads
      if (uc === "office") return part.perf * 0.4 + (Math.min(part.vram, 24) / 24) * 100 * 0.6;
      if (uc === "ai") return part.perf * 0.5 + (Math.min(part.vram, 32) / 32) * 100 * 0.5;
      // workstation (Blender/CAD/Maya): VRAM is critical for large scenes
      if (uc === "workstation") return part.perf * 0.6 + (Math.min(part.vram, 32) / 32) * 100 * 0.4;
      if (uc === "content") return part.perf * 0.7 + (Math.min(part.vram, 32) / 32) * 100 * 0.3;
      // streaming: Nvidia NVENC is significantly better than AMD's encoder for broadcast
      // Also penalize weak GPUs (Arc B570 etc) that can't handle high-bitrate encoding
      if (uc === "streaming") {
        const isNvidia = /nvidia|rtx|gtx/i.test(part.brand || part.name || "");
        const baseScore = isNvidia ? part.perf * 1.4 : part.perf;
        // Weak GPU penalty: sub-30 perf GPUs lose credibility for streaming
        if (part.perf < 30) return baseScore * 0.75;
        return baseScore;
      }
      return part.perf;
    case "ram": {
      // value-aware speed: peaks at DDR5-6000 (the CL30 sweet spot). Faster kits
      // (6400/7200) cost more for no real-world gain, so they score LOWER; slower dips too.
      const sp = part.speed <= 6000
        ? (part.speed / 6000) * 50
        : Math.max(20, 50 - ((part.speed - 6000) / 100) * 1.5);
      if (heavyRam) return sp * 0.4 + (Math.min(part.cap, 96) / 96) * 100 * 0.6; // capacity-led
      return sp + (part.cap >= 32 ? 50 : (part.cap / 32) * 50); // 32GB is the sweet spot
    }
    case "storage":
      if (uc === "content" || uc === "workstation")
        return part.perf * 0.5 + (Math.min(part.cap, 4000) / 4000) * 100 * 0.5;
      // ai: datasets are huge — capacity matters most, target 4TB
      if (uc === "ai")
        return part.perf * 0.4 + (Math.min(part.cap, 4000) / 4000) * 100 * 0.6;
      // streaming: fast NVMe matters for recording high-bitrate footage — weight speed higher
      if (uc === "streaming")
        return part.perf * 0.65 + (Math.min(part.cap, 2000) / 2000) * 100 * 0.35;
      // office: NVMe speed + large capacity (archives, files)
      if (uc === "office") return part.perf * 0.5 + (Math.min(part.cap, 4000) / 4000) * 100 * 0.5;
      // gaming: reward capacity up to 2TB
      return part.perf * 0.6 + (Math.min(part.cap, 2000) / 2000) * 100 * 0.4;
    default:
      return part.perf; // mobo, psu, case, cooler: use-case agnostic
  }
}
const _ucMax = {};
function ucMaxPerf(cat, uc) {
  const k = cat + "|" + uc;
  if (_ucMax[k] == null) _ucMax[k] = Math.max(...CATALOG[cat].map((p) => ucPerf(cat, p, uc)));
  return _ucMax[k];
}

// Best use-case performance among parts that actually FIT the category's budget band
// (with a little stretch). Part scores are normalized against THIS, not the global
// 5090-tier ceiling — so the best part you can afford in a slot scores ~100, and a
// budget pick only looks weak in a build where you could have afforded much more.
const _affMax = {};
function affordableMaxPerf(cat, band, useCase) {
  const k = cat + "|" + Math.round(band) + "|" + useCase;
  if (_affMax[k] == null) {
    const cap = band > 0 ? band * 1.1 : Infinity;
    let mx = 0;
    for (const p of CATALOG[cat]) if (p.price <= cap) { const v = ucPerf(cat, p, useCase); if (v > mx) mx = v; }
    _affMax[k] = mx || ucMaxPerf(cat, useCase); // fall back to global if nothing fits
  }
  return _affMax[k];
}

// Diminishing-returns ceilings: spending past these on a category is poor value,
// so the part's score is reduced (but it is NOT flagged over budget).
const VALUE_CEILING = { mobo: 250 };

// ---- Bottleneck detection ----
function detectBottleneck(parts) {
  if (!parts.cpu || !parts.gpu) return null;
  const cpuP = parts.cpu.perf || 50, gpuP = parts.gpu.perf || 50;
  const ratio = gpuP / cpuP;
  if (ratio > 2.8) return { type: "cpu", msg: `CPU bottleneck — your ${parts.cpu.name} may hold back the ${parts.gpu.name}. Consider a faster CPU.` };
  if (ratio < 0.45) return { type: "gpu", msg: `GPU bottleneck — your ${parts.gpu.name} may hold back the ${parts.cpu.name}. Consider a faster GPU.` };
  return null;
}

// ---- Noise rating ----
function noiseRating(parts) {
  if (!parts.cooler) return { label: "Unknown", color: "#7c8798" };
  const t = (parts.cooler.type || "").toLowerCase();
  if (t === "aio" || /aio|liquid|water/i.test(parts.cooler.name || "")) return { label: "Quiet", color: "#46e0a0" };
  if (t === "air" || /air/i.test(parts.cooler.name || "")) {
    const tdp = parts.cooler.tdpRating || 0;
    if (tdp >= 280) return { label: "Moderate", color: "#ffc24b" };
    return { label: "Quiet", color: "#46e0a0" };
  }
  return { label: "Moderate", color: "#ffc24b" };
}

// ---- Build badges ----
function buildBadges(parts, analysis, useCase) {
  const badges = [];
  const perf = analysis.score || 0, pp = analysis.ppScore || 0;
  const total = analysis.total || 0;
  if (perf > 900) badges.push({ label: "Overkill", icon: "💀", color: "#ff5c72" });
  if (pp > 80 && total < 1200) badges.push({ label: "Budget King", icon: "👑", color: "#ffc24b" });
  if (pp > 85) badges.push({ label: "Value Champ", icon: "💰", color: "#46e0a0" });
  if (perf > 750 && noiseRating(parts).label === "Quiet") badges.push({ label: "Silent Beast", icon: "🤫", color: "#7c5cff" });
  if (useCase === "gaming" && perf > 800) badges.push({ label: "Frame Monster", icon: "🎮", color: "#19e8db" });
  if (useCase === "ai" && (parts.gpu?.vram || 0) >= 24) badges.push({ label: "AI Ready", icon: "🧠", color: "#7c5cff" });
  if (useCase === "workstation" && perf > 700) badges.push({ label: "Pro Rig", icon: "🏆", color: "#19e8db" });
  if (analysis.compat && !analysis.compat.pass) badges.push({ label: "Needs Fixes", icon: "⚠️", color: "#ff5c72" });
  return badges;
}

// ---- Power cost estimate ----
function powerCostMonthly(parts, kwhRate = 0.13, hoursPerDay = 6) {
  const watts = requiredWatts(parts) * 0.75; // avg load ~75%
  return (watts / 1000) * hoursPerDay * 30 * kwhRate;
}

// ---- Build share link (encode/decode) ----
function encodeBuild(useCase, budget, parts) {
  try { return btoa(encodeURIComponent(JSON.stringify({ useCase, budget, parts }))); } catch(e) { return null; }
}
function decodeBuild(str) {
  try { return JSON.parse(decodeURIComponent(atob(str))); } catch(e) { return null; }
}

// ---- Batch 1: Performance & Thermals helpers ----
function thermalEstimate(parts) {
  const cpuTdp = parts.cpu?.tdp || 0;
  const coolerRating = parts.cooler?.tdpRating || 65;
  const isAio = /aio|liquid|water/i.test((parts.cooler?.type || "") + (parts.cooler?.name || ""));
  let cpuLoad = cpuTdp > 0 ? Math.min(95, 40 + Math.round((cpuTdp / coolerRating) * 50)) : null;
  if (cpuLoad && isAio) cpuLoad = Math.max(40, cpuLoad - 8);
  const gpuTdp = parts.gpu?.tdp || 0;
  const gpuLoad = gpuTdp > 0 ? (gpuTdp > 300 ? 84 : gpuTdp > 200 ? 77 : 68) : null;
  return { cpuLoad, gpuLoad, isAio };
}
function vrReadiness(parts) {
  const checks = [
    { label: "CPU (6+ cores)", ok: (parts.cpu?.cores || 0) >= 6, detail: parts.cpu ? `${parts.cpu.cores} cores` : "No CPU" },
    { label: "RAM (16GB+)", ok: (parts.ram?.cap || 0) >= 16, detail: parts.ram ? `${parts.ram.cap}GB` : "No RAM" },
    { label: "GPU (8GB+ VRAM)", ok: (parts.gpu?.vram || 0) >= 8, detail: parts.gpu ? `${parts.gpu.vram}GB VRAM` : "No GPU" },
  ];
  const pass = checks.every(c => c.ok);
  const vram = parts.gpu?.vram || 0;
  return { pass, checks, tier: pass ? (vram >= 12 ? "VR Ultra" : "VR Ready") : "Not VR Ready" };
}
function gaming4K(parts) {
  const vram = parts.gpu?.vram || 0, perf = parts.gpu?.perf || 0;
  if (!parts.gpu) return { tier: "No GPU", color: "var(--c-muted)", ready: false };
  if (vram >= 16 && perf >= 85) return { tier: "4K Ultra", color: "var(--c-good)", ready: true };
  if (vram >= 12 && perf >= 70) return { tier: "4K High", color: "var(--c-accent)", ready: true };
  if (vram >= 10 && perf >= 55) return { tier: "4K Medium", color: "var(--c-warn)", ready: true };
  if (vram >= 8 && perf >= 40) return { tier: "1440p Best", color: "var(--c-accent2)", ready: false };
  return { tier: "1080p", color: "var(--c-muted)", ready: false };
}
function overclockSim(parts) {
  if (!parts.cpu) return null;
  const cpu = parts.cpu;
  const isUnlocked = /\bK\b|\bKF\b|\bKS\b|\bX\b|\bXT\b|\bX3D\b/i.test(cpu.name || "");
  const coolerOk = (parts.cooler?.tdpRating || 0) >= (cpu.tdp || 0) * 1.15;
  const ramType = parts.ram?.ramType || "DDR4";
  const ramSpeed = parts.ram?.speed || 3200;
  const ramTarget = ramType === "DDR5" ? Math.min(7200, ramSpeed + 800) : Math.min(4000, ramSpeed + 400);
  const ramGain = Math.round(((ramTarget - ramSpeed) / ramSpeed) * 100 * 0.4);
  const cpuGain = isUnlocked && coolerOk ? "3–8% performance gain possible with manual OC" : "CPU or cooler limits overclocking headroom";
  return { isUnlocked, coolerOk, cpuGain, ramSpeed, ramTarget, ramGain };
}
function memBandwidth(parts) {
  if (!parts.ram) return null;
  const speed = parts.ram.speed || 3200, type = parts.ram.ramType || "DDR4";
  const bw = Math.round(speed * 2 * 2 / 1000 * 10) / 10;
  return { bw, type, speed, tier: bw > 120 ? "Excellent" : bw > 80 ? "Good" : bw > 50 ? "Average" : "Low" };
}
function storageTier(parts) {
  if (!parts.storage) return null;
  const iface = parts.storage.iface || "", kind = parts.storage.kind || "SATA";
  if (/Gen\s?5|PCIe\s?5/i.test(iface)) return { tier: "PCIe 5.0 NVMe", speed: "~14,000 MB/s", color: "var(--c-good)", gameLoad: "Under 1 sec" };
  if (/Gen\s?4|PCIe\s?4/i.test(iface)) return { tier: "PCIe 4.0 NVMe", speed: "~7,000 MB/s", color: "var(--c-accent)", gameLoad: "1–2 sec" };
  if (/Gen\s?3|PCIe\s?3|NVMe/i.test(iface) || kind === "NVMe") return { tier: "PCIe 3.0 NVMe", speed: "~3,500 MB/s", color: "var(--c-accent2)", gameLoad: "2–4 sec" };
  return { tier: "SATA SSD", speed: "~550 MB/s", color: "var(--c-warn)", gameLoad: "5–10 sec" };
}

// ---- Batch 5: 10 new More-menu features ----
const FPS_GAMES = [
  { name:"Cyberpunk 2077", demand:1.0, icon:"🤖" },
  { name:"Fortnite (Epic)", demand:0.45, icon:"🏗️" },
  { name:"Warzone (High)", demand:0.65, icon:"🪖" },
  { name:"Elden Ring", demand:0.70, icon:"⚔️" },
  { name:"Baldur's Gate 3", demand:0.60, icon:"🐉" },
  { name:"GTA V (Max)", demand:0.55, icon:"🚗" },
  { name:"Starfield (High)", demand:0.85, icon:"🚀" },
  { name:"CS2 (High)", demand:0.28, icon:"🔫" },
  { name:"Valorant", demand:0.22, icon:"🎯" },
  { name:"Minecraft RTX", demand:0.75, icon:"⛏️" },
];
function fpsEstimate(gpuPerf, demand, resMult) {
  const base = (gpuPerf / 100) * 300;
  return Math.max(1, Math.round(base / demand / Math.sqrt(resMult)));
}
const GAME_SPECS = [
  { name:"Cyberpunk 2077 (Ultra RT)", minCores:8, minRam:16, minVram:12, recCores:12, recRam:32, recVram:24 },
  { name:"Warzone (High)", minCores:6, minRam:16, minVram:8, recCores:8, recRam:32, recVram:12 },
  { name:"MS Flight Sim 2024", minCores:6, minRam:32, minVram:8, recCores:12, recRam:64, recVram:16 },
  { name:"Baldur's Gate 3 (Ultra)", minCores:8, minRam:16, minVram:8, recCores:12, recRam:32, recVram:12 },
  { name:"Starfield (High)", minCores:6, minRam:16, minVram:8, recCores:8, recRam:32, recVram:12 },
  { name:"CS2 (High)", minCores:4, minRam:8, minVram:4, recCores:6, recRam:16, recVram:8 },
  { name:"Fortnite (Epic)", minCores:4, minRam:8, minVram:4, recCores:8, recRam:16, recVram:8 },
  { name:"Elden Ring (Max)", minCores:4, minRam:12, minVram:6, recCores:8, recRam:16, recVram:8 },
];
function buildReportCard(parts, analysis, useCase) {
  const UC = USE_CASES[useCase];
  const spend = analysis?.spend || 1;
  return Object.fromEntries(CATEGORY_ORDER.map(cat => {
    if (!parts[cat]) return [cat, { grade:"—", color:"var(--c-muted)", score:0 }];
    const band = ((UC.alloc[cat] || 0) / 100) * spend;
    const sc = partScore({ ...parts[cat], cat }, band, useCase);
    const grade = sc >= 85 ? "A" : sc >= 70 ? "B" : sc >= 55 ? "C" : sc >= 40 ? "D" : "F";
    const color = sc >= 85 ? "var(--c-good)" : sc >= 70 ? "var(--c-accent)" : sc >= 55 ? "var(--c-warn)" : "var(--c-bad)";
    return [cat, { grade, color, score: sc }];
  }));
}
function buildTierRating(analysis) {
  const s = analysis?.score || 0;
  if (s >= 950) return { tier:"S+", label:"Legendary", color:"#ff6b6b", desc:"A once-in-a-generation machine." };
  if (s >= 850) return { tier:"S",  label:"Elite",     color:"#ffd700", desc:"Top 1% builds. Handles absolutely anything." };
  if (s >= 700) return { tier:"A",  label:"High-End",  color:"var(--c-good)", desc:"Excellent for demanding workloads." };
  if (s >= 550) return { tier:"B",  label:"Mid-Range", color:"var(--c-accent)", desc:"Great for most games and tasks." };
  if (s >= 400) return { tier:"C",  label:"Entry",     color:"var(--c-warn)", desc:"Solid for everyday use." };
  return             { tier:"D",  label:"Budget",    color:"var(--c-bad)", desc:"Light use only — upgrade key parts." };
}
function smartTips(parts, analysis, useCase) {
  const tips = [];
  const bn = detectBottleneck(parts);
  if (bn) tips.push({ icon:"⚡", text: bn.msg });
  if ((parts.ram?.cap||0) <= 16 && ["workstation","content","ai"].includes(useCase))
    tips.push({ icon:"🧠", text:`16GB RAM is tight for ${USE_CASES[useCase].label}. Upgrading to 32GB+ helps significantly.` });
  if ((parts.gpu?.vram||0) <= 8 && useCase === "ai")
    tips.push({ icon:"🤖", text:"8GB VRAM is very limiting for AI/ML. 24GB+ is recommended for local model inference." });
  if (!parts.cooler && (parts.cpu?.tdp||0) >= 105)
    tips.push({ icon:"🌡️", text:`${parts.cpu.tdp}W CPU needs a proper cooler — stock/no cooler risks thermal throttling.` });
  const pwr = parts.psu ? (parts.psu.watt - requiredWatts(parts)) : 999;
  if (pwr < 50 && parts.psu) tips.push({ icon:"🔌", text:`PSU has only ${pwr}W headroom — consider a higher-wattage unit.` });
  if (parts.storage?.kind === "SATA")
    tips.push({ icon:"💾", text:"SATA SSD is much slower than NVMe — upgrading to M.2 NVMe gives 10× faster load times." });
  if ((analysis?.ppScore||0) < 50)
    tips.push({ icon:"💰", text:"Price/performance is below average. Some part swaps could give much better value." });
  if (parts.ram?.ramType === "DDR4" && ["AM5","LGA1851"].includes(parts.cpu?.socket||""))
    tips.push({ icon:"⚠️", text:"DDR4 with an AM5/LGA1851 CPU is unusual — double-check mobo compatibility." });
  if (tips.length === 0) tips.push({ icon:"✅", text:"Your build is well-optimized! No major issues found." });
  return tips;
}
function powerBreakdown(parts) {
  const items = [
    { label:"CPU",   watts: parts.cpu?.tdp || 0 },
    { label:"GPU",   watts: parts.gpu?.tdp || 0 },
    { label:"RAM",   watts: (parts.ram?.cap||0) >= 64 ? 15 : 8 },
    { label:"Storage", watts: parts.storage ? 6 : 0 },
    { label:"Motherboard", watts: parts.mobo ? 35 : 0 },
    { label:"Fans",  watts: 12 },
    { label:"Other", watts: 18 },
  ].filter(i => i.watts > 0);
  return { items, total: items.reduce((s,i)=>s+i.watts,0) };
}
const PERIPHERAL_SETS = {
  gaming:     { monitor:["240Hz 1080p (competitive)","165Hz 1440p (sweet spot)","144Hz 4K (premium)"], mouse:["Logitech G Pro X Superlight 2","Razer DeathAdder V3","Zowie EC2-C"], kb:["Wooting 60HE","SteelSeries Apex Pro","Ducky One 3"] },
  content:    { monitor:["4K 60Hz IPS (colour accurate)","1440p 144Hz wide-gamut","Dual 1080p setup"],   mouse:["Logitech MX Master 3S","Razer Pro Click","Microsoft Arc Mouse"], kb:["Logitech MX Keys","Keychron K8 Pro","Apple Magic Keyboard"] },
  workstation:{ monitor:["32″ 4K IPS (calibrated)","Ultrawide 3440×1440","Dual 27″ 4K"],              mouse:["Logitech MX Master 3S","Kensington Expert Mouse","3M AKT850LE Ergo"], kb:["Logitech MX Keys","Kinesis Advantage 360","Das Keyboard 4 Pro"] },
  streaming:  { monitor:["1440p 144Hz (play + stream)","27″ 1080p 240Hz","Dual 1080p capture setup"], mouse:["Logitech G502 X Plus","Razer Basilisk V3","SteelSeries Rival 650"], kb:["SteelSeries Apex Pro","Razer BlackWidow V4","Corsair K100 RGB"] },
  ai:         { monitor:["32″ 4K IPS","Dual 27″ 1440p","Ultrawide 3440×1440"],                        mouse:["Logitech MX Master 3S","Microsoft Precision Mouse","Logitech MX Anywhere 3"], kb:["Keychron Q1 Pro","Logitech MX Keys","ZSA Moonlander"] },
  office:     { monitor:["24″ 1080p IPS","27″ 1440p","Dual 24″ 1080p"],                               mouse:["Logitech M750","Microsoft Precision Mouse","Logitech MX Anywhere 3"],        kb:["Logitech K380","Keychron K3 Pro","Microsoft Sculpt Ergo"] },
};
const ERA_BUILDS = [
  { year:"2022", budget:2000, desc:"RTX 3070 + i5-12600K + 16GB DDR4 + 1TB NVMe", score:72, note:"PCIe 4.0 era, DDR4, ~$2000" },
  { year:"2024", budget:2000, desc:"RTX 4070 Super + R7 7800X3D + 32GB DDR5 + 2TB NVMe", score:88, note:"AM5 platform, DDR5, ~$2000" },
  { year:"2026", budget:2000, desc:"RTX 5070 / RX 9070 + R7 9800X3D + 32GB DDR5 + 2TB NVMe", score:96, note:"Current gen — plus AI-era RAM shortage premium" },
];

// ---- Batch 2: Compatibility & Warnings helpers ----
function deprecationAlerts(parts) {
  const alerts = [];
  if (parts.ram?.ramType === "DDR4") alerts.push({ sev:"warn", text:"DDR4 is end-of-life — DDR5 platforms offer better longevity and upgrade path." });
  if (parts.cpu?.socket === "AM4") alerts.push({ sev:"warn", text:"AM4 socket is discontinued. No future AMD CPUs will support it." });
  if (parts.cpu?.socket === "LGA1200") alerts.push({ sev:"bad", text:"LGA1200 (10th/11th Gen Intel) is end-of-life with no upgrade path." });
  if (parts.cpu?.socket === "LGA1700") alerts.push({ sev:"info", text:"LGA1700 (12th–14th Gen Intel) is succeeded by LGA1851. No future Intel CPUs will support it." });
  if (parts.storage?.kind === "SATA" && !/HDD/i.test(parts.storage?.name || "")) alerts.push({ sev:"info", text:"SATA SSD is 10× slower than NVMe — consider an M.2 NVMe drive." });
  return alerts;
}
function powerDeliveryCheck(parts) {
  const required = requiredWatts(parts);
  const psuWatt = parts.psu?.watt || 0;
  const margin = psuWatt - required;
  const spikeRequired = Math.round(required * 1.25); // GPU/CPU boost spikes ~125%
  const spikeOk = psuWatt >= spikeRequired;
  return { required, psuWatt, margin, spikeRequired, spikeOk,
    status: !parts.psu ? "none" : margin < 0 ? "bad" : margin < 80 ? "tight" : "ok" };
}
function displayOutputCheck(parts) {
  if (!parts.gpu) {
    if (parts.cpu?.igpu) return { ports: ["1× HDMI (from iGPU)", "1× DisplayPort (varies by mobo)"], note: "Ports depend on your motherboard rear I/O." };
    return { ports: [], note: "No GPU or iGPU — no display output." };
  }
  const isNv = /nvidia|rtx|gtx/i.test((parts.gpu.brand || "") + (parts.gpu.name || ""));
  const isArc = /intel|arc/i.test(parts.gpu.brand || "");
  const vram = parts.gpu.vram || 0;
  const perf = parts.gpu.perf || 0;
  const ports = perf >= 50
    ? ["3× DisplayPort 1.4a", "1× HDMI 2.1"]
    : isArc
    ? ["3× Thunderbolt 4/DP", "1× HDMI 2.1"]
    : ["2× DisplayPort 1.4", "1× HDMI 2.0"];
  const note = vram >= 16 ? "Supports 4K @ 144Hz or 8K display." : perf >= 40 ? "Supports 1440p @ 165Hz or 4K @ 60Hz." : "Supports 1080p or 1440p displays.";
  return { ports, note };
}
function biosCompatWarning(parts) {
  const warns = [];
  if (!parts.cpu || !parts.mobo) return warns;
  const cpuSocket = parts.cpu.socket, moboSocket = parts.mobo.socket;
  if (cpuSocket !== moboSocket) return warns; // compat checker already flags this
  // Flag new CPUs that may need a BIOS update on older boards
  if (cpuSocket === "LGA1700") {
    const is12th = /i[3579]-12[0-9]{3}/i.test(parts.cpu.name || "");
    const is13th = /i[3579]-13[0-9]{3}/i.test(parts.cpu.name || "");
    const is14th = /i[3579]-14[0-9]{3}/i.test(parts.cpu.name || "");
    const moboName = parts.mobo.name || "";
    const isB660 = /B660|H670|H610/i.test(moboName);
    if (is14th && isB660) warns.push("14th Gen on B660/H670 may need a BIOS update before first boot.");
    if (is13th && isB660) warns.push("13th Gen on B660 may require a BIOS flash for compatibility.");
  }
  if (cpuSocket === "AM5") {
    const isZen5 = /9[5-9][0-9]{2}X|9600X|9700X|9800X|9900X|9950X/i.test(parts.cpu.name || "");
    const moboName = parts.mobo.name || "";
    const isA620 = /A620/i.test(moboName);
    if (isZen5 && isA620) warns.push("Zen 5 CPUs on A620 boards may need a BIOS update — check manufacturer site.");
  }
  if (warns.length === 0 && (parts.cpu.perf || 0) >= 85) warns.push("High-end CPU — verify mobo BIOS supports this model before ordering.");
  return warns;
}
function usbPortEstimate(parts) {
  if (!parts.mobo) return null;
  const form = parts.mobo.form || "ATX";
  const price = parts.mobo.price || 0;
  const tier = price >= 300 ? "high" : price >= 150 ? "mid" : "budget";
  const map = {
    high:   { usb2: 4, usb3: 4, usb32: 2, usbc: 2, total: 12 },
    mid:    { usb2: 4, usb3: 4, usb32: 1, usbc: 1, total: 10 },
    budget: { usb2: 4, usb3: 2, usb32: 0, usbc: 1, total: 7  },
  };
  const itxReduction = form === "ITX" ? 2 : 0;
  const p = { ...map[tier] };
  p.total = Math.max(4, p.total - itxReduction);
  p.usb3 = Math.max(0, p.usb3 - (form === "ITX" ? 1 : 0));
  return { ...p, tier, form };
}
function cableManagementList(parts) {
  const list = [];
  if (!parts.psu) return list;
  list.push("24-pin ATX (motherboard main power)");
  if (parts.cpu) {
    const socket = parts.cpu.socket || "";
    list.push(["LGA1851","LGA1700"].includes(socket) ? "8+4 pin EPS (CPU)" : "8-pin EPS (CPU)");
  }
  if (parts.gpu) {
    const tdp = parts.gpu.tdp || 0;
    if (tdp >= 450) list.push("16-pin (600W) adapter or 4× 8-pin PCIe (GPU)");
    else if (tdp >= 300) list.push("3× 8-pin PCIe (GPU)");
    else if (tdp >= 200) list.push("2× 8-pin PCIe (GPU)");
    else list.push("1× 8-pin PCIe (GPU)");
  }
  if (parts.storage) list.push("1× SATA power (storage) or M.2 — no cable needed");
  list.push("Case fan connectors (from motherboard headers)");
  if (/modular/i.test(parts.psu?.name || "")) list.push("✓ Modular PSU — only run cables you need");
  return list;
}

// Newer GPUs are preferred — older cards are often out of stock or used-only.
function modernityFactor(part) {
  if (part.cat !== "gpu") return 1;
  const m = part.model || part.name || "";
  if (/RTX\s?50|RX\s?90|Arc\s?B/i.test(m)) return 1;      // current gen, in stock
  if (/RTX\s?40|RX\s?7[6-9]00/i.test(m)) return 0.9;      // last gen, still available
  return 0.78;                                            // older — often out of stock / used
}

// Per-part score: within the category budget band, more (use-case-relevant)
// performance is better; going over the band lowers the score gradually (a little
// over barely hurts), and current-gen GPUs get a preference for availability.
function partScore(part, band, useCase) {
  const norm =
    part.cat && useCase
      ? clamp(ucPerf(part.cat, part, useCase) / affordableMaxPerf(part.cat, band, useCase), 0, 1.15)
      : part.cat
      ? part.perf / MAX_PERF[part.cat]
      : part.perf / 100;
  // value ceiling: spending past it (e.g. >$250 on a motherboard) just lowers the
  // score for poor value — it does NOT flag the part as "over budget".
  let vmult = 1;
  const ceil = part.cat ? VALUE_CEILING[part.cat] : undefined;
  if (ceil && part.price > ceil) vmult = Math.max(0.45, 1 - (part.price / ceil - 1) * 0.45);
  let mult = 1;
  if (band > 0) {
    const r = part.price / band;
    if (r > 1) mult = Math.max(0.3, 1 - (r - 1) * 0.3); // gentle, gradual — a little over barely dents it
  } else if (part.price > 0) {
    mult = 0.4; // category isn't budgeted for at all (e.g. discrete GPU on an office build)
  }
  return Math.round(clamp(norm * 100 * mult * vmult * modernityFactor(part), 0, 100));
}
function budgetStatus(price, band) {
  if (band <= 0) return price > 0 ? "over" : "within";
  const r = price / band;
  if (r <= 1) return "within";
  if (r <= 1.25) return "tight";
  return "over";
}

/* ----------------------------- COMPATIBILITY ----------------------------- */
function requiredWatts(parts) {
  const cpu = parts.cpu?.tdp || 0;
  const gpu = parts.gpu?.tdp || 0;
  return cpu + gpu + 150; // ~150W system overhead (fans, drives, mobo, USB)
}
function checkCompat(parts) {
  const issues = [];
  const ok = [];
  const { cpu, gpu, mobo, ram, storage, psu, cooler } = parts;
  const cse = parts.case;

  if (cpu && mobo) {
    (cpu.socket === mobo.socket ? ok : issues).push(
      cpu.socket === mobo.socket
        ? `CPU socket ${cpu.socket} matches the motherboard`
        : `CPU socket ${cpu.socket} does not fit the ${mobo.socket} motherboard`
    );
  }
  if (ram && mobo) {
    (ram.ramType === mobo.ramType ? ok : issues).push(
      ram.ramType === mobo.ramType
        ? `${ram.ramType} memory matches the motherboard`
        : `${ram.ramType} memory won't work in a ${mobo.ramType} motherboard`
    );
    if (ram.cap > mobo.maxRam) issues.push(`Memory (${ram.cap}GB) exceeds the board's ${mobo.maxRam}GB limit`);
  }
  if (cooler && cpu) {
    (cooler.sockets.includes(cpu.socket) ? ok : issues).push(
      cooler.sockets.includes(cpu.socket)
        ? `Cooler supports the ${cpu.socket} socket`
        : `Cooler doesn't support the ${cpu.socket} socket`
    );
    (cooler.tdpRating >= cpu.tdp ? ok : issues).push(
      cooler.tdpRating >= cpu.tdp
        ? `Cooler handles the CPU's ${cpu.tdp}W heat output`
        : `Cooler is rated ${cooler.tdpRating}W — under the CPU's ${cpu.tdp}W`
    );
  }
  if (mobo && cse) {
    (cse.forms.includes(mobo.form) ? ok : issues).push(
      cse.forms.includes(mobo.form)
        ? `Case fits a ${mobo.form} motherboard`
        : `Case can't fit a ${mobo.form} motherboard`
    );
  }
  if (gpu && cse) {
    (gpu.len <= cse.maxGpu ? ok : issues).push(
      gpu.len <= cse.maxGpu
        ? `GPU (${gpu.len}mm) fits the case`
        : `GPU is ${gpu.len}mm — too long for this case (${cse.maxGpu}mm max)`
    );
  }
  if (cooler && cse && cooler.type === "air") {
    (cooler.height <= cse.maxCool ? ok : issues).push(
      cooler.height <= cse.maxCool
        ? `Air cooler clears the case`
        : `Cooler is ${cooler.height}mm tall — case allows ${cse.maxCool}mm`
    );
  }
  if (storage && mobo && storage.iface === "M.2") {
    (mobo.m2 >= 1 ? ok : issues).push(
      mobo.m2 >= 1 ? `M.2 slot available for the NVMe drive` : `No M.2 slot on this motherboard`
    );
  }
  if (psu) {
    const need = requiredWatts(parts);
    const safe = Math.ceil((need * 1.25) / 50) * 50;
    (psu.watt >= need * 1.25 ? ok : issues).push(
      psu.watt >= need * 1.25
        ? `${psu.watt}W PSU comfortably powers the build (~${need}W draw)`
        : `${psu.watt}W PSU is light — this build wants ~${safe}W`
    );
  }
  return { issues, ok, pass: issues.length === 0 };
}

// True if the part in `cat` introduces no compatibility issue beyond what the
// rest of the build already has. Used to zero out the score of incompatible parts.
function isPartCompatible(parts, cat) {
  if (!parts[cat]) return true;
  const withIssues = checkCompat(parts).issues.length;
  const rest = { ...parts };
  delete rest[cat];
  const withoutIssues = checkCompat(rest).issues.length;
  return withIssues <= withoutIssues;
}

/* ----------------------------- BUILD ANALYSIS ----------------------------- */
function buildPerfNorm(parts, alloc, useCase) {
  // weighted, normalized (use-case-relevant) performance of the whole build
  let sum = 0, wsum = 0;
  for (const c of CATEGORY_ORDER) {
    const w = alloc[c] || 0;
    if (w === 0) continue;
    const p = parts[c];
    const norm = p ? ucPerf(c, p, useCase) / ucMaxPerf(c, useCase) : 0;
    sum += w * norm;
    wsum += w;
  }
  return wsum ? sum / wsum : 0; // 0..1
}
function analyzeBuild(parts, useCaseKey, budget) {
  const uc = USE_CASES[useCaseKey];
  const alloc = uc.alloc;
  const compat = checkCompat(parts);
  const total = CATEGORY_ORDER.reduce((s, c) => s + (parts[c]?.price || 0), 0);
  const fitNorm = buildPerfNorm(parts, alloc, useCaseKey); // 0..1

  // balance / bottleneck (only where both GPU & CPU are weighted)
  const cpuNorm = parts.cpu ? ucPerf("cpu", parts.cpu, useCaseKey) / ucMaxPerf("cpu", useCaseKey) : 0;
  const gpuNorm = parts.gpu ? ucPerf("gpu", parts.gpu, useCaseKey) / ucMaxPerf("gpu", useCaseKey) : 0;
  let balance = 100;
  if (alloc.gpu > 0 && alloc.cpu > 0) {
    // CPU and GPU are normalized against very different ranges (a mid GPU is ~half
    // of a 5090, while a cheap X3D is near the CPU ceiling), so judge balance by a
    // tolerant gap rather than a strict ratio — only real mismatches are penalized.
    const gap = Math.abs(gpuNorm - cpuNorm);
    balance = Math.round(clamp(100 - gap * 85, 50, 100));
  }

  // budget adherence
  let budgetAdh;
  if (total <= budget) budgetAdh = Math.round(70 + 30 * (total / budget)); // reward using the budget
  else budgetAdh = Math.round(clamp(100 - ((total - budget) / budget) * 180, 0, 100));

  // completeness (office legitimately skips a discrete GPU)
  const need = CATEGORY_ORDER.filter((c) => !(c === "gpu" && alloc.gpu === 0));
  const have = need.filter((c) => parts[c]).length;
  const completeness = Math.round((have / need.length) * 100);
  const missing = need.filter((c) => !parts[c]);
  const complete = missing.length === 0;

  // ---- PERFORMANCE: use-case performance of the parts, scored out of 1000 ----
  // An incompatible build won't run, so its performance is 0.
  const score = compat.pass ? Math.round(clamp(fitNorm * 1000, 0, 1000)) : 0;

  // ---- PRICE / PERFORMANCE: how much performance you get per dollar (value) ----
  const pp = total > 0 ? (fitNorm / total) * 100000 : 0;
  const ppScore = compat.pass ? Math.round(clamp(pp * 1.2, 0, 100)) : 0;

  const bottleneck =
    alloc.gpu > 0 && alloc.cpu > 0
      ? gpuNorm - cpuNorm > 0.42
        ? "cpu"
        : cpuNorm - gpuNorm > 0.42
        ? "gpu"
        : null
      : null;

  return { compat, total, fitNorm, balance, budgetAdh, completeness, missing, complete, score, ppScore, bottleneck };
}

/* ----------------------------- ARCHETYPE CLASSIFIER ----------------------------- */
// Tags a finished build with a flavor archetype from its score breakdown + parts.
// Checked in priority order — first match wins — then falls back to "Balanced Build".
function classifyArchetype(build, ucKey, budget) {
  if (!build || !budget) return null;
  const a = analyzeBuild(build, ucKey, budget);
  if (!a.compat.pass || !a.complete) return null; // nothing to classify on a broken/incomplete build
  const cpu = build.cpu, cooler = build.cooler, ram = build.ram, storage = build.storage;
  const spendPct = a.total / budget;
  if (spendPct <= 0.8 && a.ppScore >= 70) return { tag: "Budget Slayer", emoji: "💰", desc: "Elite value — huge performance for the price." };
  if (cooler && cooler.type === "aio" && cpu && (cpu.tdp || 0) <= 105) return { tag: "Thermal Monster", emoji: "🧊", desc: "Liquid-cooled overkill for a CPU that barely runs warm." };
  if ((ram && ram.cap >= 64) || (storage && storage.cap >= 2000)) return { tag: "Bandwidth Hog", emoji: "📡", desc: "Stacked on memory and storage capacity." };
  if (cpu && (cpu.tdp || 0) <= 65 && a.score >= 550) return { tag: "Silent Beast", emoji: "🤫", desc: "Strong performance from a low-power chip." };
  if (a.bottleneck === "gpu") return { tag: "Glass Cannon", emoji: "🔮", desc: "GPU-heavy — a stronger CPU would back it up better." };
  if (a.bottleneck === "cpu") return { tag: "Workhorse", emoji: "⚙️", desc: "CPU-heavy — there's GPU headroom left to spend." };
  if (a.budgetAdh >= 96) return { tag: "Min-Maxer", emoji: "🎯", desc: "Spent the budget down to the last dollar." };
  return { tag: "Balanced Build", emoji: "⚖️", desc: "Even allocation across every category." };
}

/* ----------------------------- BUILD MENTOR AI ----------------------------- */
// Finds the single one-category swap (any catalog part for that slot) that moves the
// build's total score the most, so a loss can be explained as "this swap would have
// closed it" rather than a vague stat dump.
function bestMentorSwap(build, ucKey, budget) {
  const current = moggerScore(build, ucKey, budget);
  let best = null;
  for (const c of CATEGORY_ORDER) {
    const cur = build[c]; if (!cur) continue;
    for (const o of moggerOptions(c)) {
      if (o.id === cur.id) continue;
      const trial = { ...build, [c]: o };
      const s = moggerScore(trial, ucKey, budget);
      const delta = s.total - current.total;
      if (delta <= 0) continue;
      if (!best || delta > best.delta) best = { cat: c, from: cur, to: o, delta, newTotal: s.total };
    }
  }
  return best;
}
function mentorExplain(swap, ucKey) {
  const { cat, from, to } = swap;
  const maxP = ucMaxPerf(cat, ucKey);
  const fromPct = from && maxP ? Math.round(ucPerf(cat, from, ucKey) / maxP * 100) : 0;
  const toPct = to && maxP ? Math.round(ucPerf(cat, to, ucKey) / maxP * 100) : 0;
  const priceDelta = to.price - from.price;
  const priceNote = priceDelta === 0 ? "for the same price" : priceDelta > 0 ? `for $${priceDelta} more` : `for $${-priceDelta} less`;
  return `${CAT_META[cat].label}: ${to.model || to.name} scores ${toPct}% for ${USE_CASES[ucKey].label} vs your ${from.model || from.name}'s ${fromPct}% — ${priceNote}.`;
}

/* HYBRID verdict: the engine owns the number, this narrates it.
   Drop-in point for a live Claude API call — keep it cached/frozen on save
   so a saved build's number never drifts. */
function generateVerdict(parts, a, useCaseKey, budget) {
  const uc = USE_CASES[useCaseKey].label.toLowerCase();
  const out = [];
  if (a.missing && a.missing.length) {
    if (a.missing.length >= 5)
      return `Pick your parts to forge this ${uc} build — scores and compatibility update live as you add them.`;
    out.push(`Still to add: ${a.missing.map((c) => CAT_META[c].label).join(", ")}.`);
  }
  if (!a.compat.pass) {
    out.push(`This build won't run as-is — ${a.compat.issues.length} compatibility ${a.compat.issues.length === 1 ? "problem needs" : "problems need"} fixing before anything else matters.`);
  } else if (a.balance >= 82 && a.complete) {
    out.push(`A well-rounded ${uc} build — the parts are matched and the money landed where it counts.`);
  } else if (a.balance >= 62) {
    out.push(`A solid ${uc} build with a sensible balance of parts for the budget.`);
  } else if (a.balance >= 45) {
    out.push(`A decent ${uc} build, though the part balance could be tightened.`);
  } else {
    out.push(`The parts are a little mismatched for ${uc} — worth rebalancing the big-ticket parts.`);
  }
  if (a.bottleneck === "cpu") out.push(`The CPU is lagging the GPU and will bottleneck it in CPU-heavy moments — consider trading some GPU down for a stronger CPU.`);
  else if (a.bottleneck === "gpu") out.push(`The GPU is the weak link here — for ${uc} you'd usually push more budget toward it.`);
  if (a.total > budget) out.push(`It's ${fmt(a.total - budget)} over your ${fmt(budget)} budget.`);
  else if (budget - a.total > budget * 0.12) out.push(`You've left ${fmt(budget - a.total)} on the table — that headroom could upgrade the highest-impact part.`);
  if (a.compat.pass && a.total <= budget && a.budgetAdh >= 92) out.push(`It uses almost all of your budget — the money is well allocated.`);
  else if (a.compat.pass && a.complete && a.total <= budget * 0.8) out.push(`It comes in well under budget — there's room to push a key part higher.`);
  return out.join(" ");
}

/* ----------------------------- AUTO-ASSEMBLE ----------------------------- */
// Greedy, compatibility-aware, budget-aware. Picks in dependency order.
function assembleBuild(useCaseKey, budget) {
  return moggerAI(useCaseKey, budget, 3000);
}

/* ----------------------------- STORAGE WRAPPER ----------------------------- */
// Uses the artifact persistent storage API when present; falls back to an
// in-memory object so the app never crashes in a preview.
const memStore = {};
const LS = () => { try { return typeof localStorage !== "undefined" ? localStorage : null; } catch (e) { return null; } };
async function sSet(key, val) {
  try { if (typeof window !== "undefined" && window.storage) { await window.storage.set(key, JSON.stringify(val)); return; } } catch (e) {}
  try { const ls = LS(); if (ls) { ls.setItem(key, JSON.stringify(val)); return; } } catch (e) {}
  memStore[key] = JSON.stringify(val);
}
async function sDel(key) {
  try { if (typeof window !== "undefined" && window.storage) { await window.storage.delete(key); return; } } catch (e) {}
  try { const ls = LS(); if (ls) { ls.removeItem(key); return; } } catch (e) {}
  delete memStore[key];
}
async function sList(prefix) {
  try {
    if (typeof window !== "undefined" && window.storage) {
      const r = await window.storage.list(prefix);
      const keys = (r && r.keys) || [];
      return keys.map((k) => (typeof k === "string" ? k : k.key));
    }
  } catch (e) {}
  try { const ls = LS(); if (ls) return Object.keys(ls).filter((k) => k.startsWith(prefix)); } catch (e) {}
  return Object.keys(memStore).filter((k) => k.startsWith(prefix));
}
async function sGet(key) {
  try { if (typeof window !== "undefined" && window.storage) { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; } } catch (e) {}
  try { const ls = LS(); if (ls) { const v = ls.getItem(key); return v ? JSON.parse(v) : null; } } catch (e) {}
  return memStore[key] ? JSON.parse(memStore[key]) : null;
}

/* ----------------------------- HOOKS / SMALL UI ----------------------------- */
function useCountUp(target, duration = 900, startDelay = 0) {
  const [v, setV] = useState(0);
  const raf = useRef();
  const timer = useRef();
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    clearTimeout(timer.current);
    setV(0);
    timer.current = setTimeout(() => {
      let start;
      const step = (t) => {
        if (!start) start = t;
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setV(target * eased);
        if (p < 1) raf.current = requestAnimationFrame(step);
        else setV(target);
      };
      raf.current = requestAnimationFrame(step);
    }, startDelay);
    return () => { cancelAnimationFrame(raf.current); clearTimeout(timer.current); };
  }, [target, duration, startDelay]);
  return v;
}

function Gauge({ value, max = 100, size = 132, label, accent = "var(--c-accent)", delay = 0 }) {
  const [tick, setTick] = useState(0);
  const v = useCountUp(tick > 0 ? value : 0, 3200, 0);
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - clamp(v / max, 0, 1));
  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  const handleMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setMouse({ x: dx, y: dy });
  }, []);
  const tilt = hovered
    ? `perspective(400px) rotateX(${-mouse.y * 10}deg) rotateY(${mouse.x * 10}deg) scale(1.10)`
    : "perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)";
  return (
    <div
      ref={ref}
      className={"rf-gauge" + (hovered ? " rf-gauge-active" : "")}
      style={{ width: size, height: size, animationDelay: delay + "ms", transform: tilt, transition: hovered ? "transform 0.06s ease-out" : "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)", cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMouse({ x: 0, y: 0 }); }}
      onMouseMove={handleMove}
      onClick={() => setTick(t => t + 1)}
    >
      <svg width={size} height={size} style={{ overflow: "visible" }}>
        <defs>
          <filter id={"gaugeLiquid-" + label} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="8" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={hovered ? "5" : "0"} xChannelSelector="R" yChannelSelector="G" result="displaced" style={{ transition: "all 0.3s ease" }} />
          </filter>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--c-track)" strokeWidth="10" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={accent} strokeWidth={hovered ? "12" : "10"} fill="none"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          filter={`url(#gaugeLiquid-${label})`}
          style={{ strokeWidth: hovered ? "12" : "10", transition: "stroke-width 0.3s ease", filter: `drop-shadow(0 0 ${hovered ? 18 : 8}px ${accent})` }}
        />
      </svg>
      <div className="rf-gauge-center">
        <div className="rf-gauge-num" style={{ color: accent, fontSize: String(Math.round(v)).length >= 4 ? "26px" : undefined, textShadow: hovered ? `0 0 24px ${accent}, 0 0 8px ${accent}` : "none", transition: "text-shadow 0.3s ease" }}>{Math.round(v)}</div>
        <div className="rf-gauge-label">{label}</div>
      </div>
    </div>
  );
}

const scoreColor = (s) => (s >= 80 ? "var(--c-good)" : s >= 60 ? "var(--c-accent)" : s >= 40 ? "var(--c-warn)" : "var(--c-bad)");

/* Rich, labeled spec sheet per part so the AI reasons from real data (with units). */
function describePart(cat, p) {
  const d = { name: p.name, brand: p.brand, ratingOutOf100: p.perf };
  if (cat === "cpu") Object.assign(d, { cores: p.cores, tdpWatts: p.tdp, socket: p.socket, integratedGraphics: !!p.igpu });
  else if (cat === "gpu") Object.assign(d, { vramGB: p.vram, tdpWatts: p.tdp, lengthMm: p.len });
  else if (cat === "ram") Object.assign(d, { type: p.ramType, capacityGB: p.cap, speedMHz: p.speed });
  else if (cat === "storage") Object.assign(d, { driveType: p.kind, capacityGB: p.cap, interface: p.iface });
  else if (cat === "psu") Object.assign(d, { wattage: p.watt, efficiencyRating: p.eff });
  else if (cat === "cooler") Object.assign(d, { coolerType: p.type, ratedForTdpWatts: p.tdpRating, heightMm: p.height, fitsSockets: p.sockets });
  else if (cat === "mobo") Object.assign(d, { socket: p.socket, memoryType: p.ramType, formFactor: p.form, m2Slots: p.m2, maxMemoryGB: p.maxRam });
  else if (cat === "case") Object.assign(d, { supportsFormFactors: p.forms, maxGpuLengthMm: p.maxGpu, maxAirCoolerHeightMm: p.maxCool });
  return d;
}

/* ----------------------------- MAIN APP ----------------------------- */
// Lightweight animated particle field — drifting cyan/purple motes behind the UI.
function ParticleField() {
  const ref = useRef(null);
  useEffect(() => {
    const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1, raf = 0, parts = [];
    const COLORS = ["25,232,219", "124,92,255"]; // cyan, purple
    const spawn = () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.9 + 0.5,
      vx: (Math.random() - 0.5) * 0.13,
      vy: (Math.random() - 0.5) * 0.13 - 0.03,
      a: Math.random() * 0.5 + 0.15,
      c: COLORS[Math.random() < 0.72 ? 0 : 1],
      tw: Math.random() * Math.PI * 2,
    });
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(72, (w * h) / 22000));
      parts = Array.from({ length: target }, spawn);
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy; p.tw += 0.014;
        if (p.x < -12) p.x = w + 12; else if (p.x > w + 12) p.x = -12;
        if (p.y < -12) p.y = h + 12; else if (p.y > h + 12) p.y = -12;
        const a = p.a * (0.55 + 0.45 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + p.c + "," + a.toFixed(3) + ")";
        ctx.shadowBlur = 9; ctx.shadowColor = "rgba(" + p.c + "," + a.toFixed(3) + ")";
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(tick);
    };
    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="rf-particles" aria-hidden="true" />;
}

function OfflineBanner({ offlinePriceStatus, priceInfo }) {
  const fmtTs = (ts) => {
    if (!ts) return null;
    const d = new Date(Number(ts));
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " at " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  };
  const cached = offlinePriceStatus === "cached";
  const sample = offlinePriceStatus === "sample" || (!offlinePriceStatus && !priceInfo);
  const ts = priceInfo && priceInfo.cacheTs ? fmtTs(priceInfo.cacheTs) : null;
  return (
    <div className="rf-offline-banner" role="alert">
      <span className="rf-offline-dot" />
      <span className="rf-offline-label">OFFLINE</span>
      <span className="rf-offline-sep">·</span>
      {cached && ts ? <span>Prices from {ts}</span> : cached ? <span>Showing last known prices</span> : sample ? <span>No cached prices — showing sample data</span> : <span>Prices may be outdated</span>}
      <span className="rf-offline-sep">·</span>
      <span>AI unavailable</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// STRIPE — no config needed in the app. The serverless function holds the keys
// (set STRIPE_SECRET_KEY + STRIPE_PUBLISHABLE_KEY in Vercel) and returns the
// publishable key with each session, so checkout "just works" once those two
// env vars are set. See api/create-checkout-session.js.
// Load Stripe.js once (no npm dependency — just the official script tag).
// ---------------------------------------------------------------------------
let _stripeJsPromise = null;
function loadStripeJs() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.Stripe) return Promise.resolve(window.Stripe);
  if (!_stripeJsPromise) {
    _stripeJsPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://js.stripe.com/v3/";
      s.async = true;
      s.onload = () => resolve(window.Stripe);
      s.onerror = () => reject(new Error("Could not load Stripe.js"));
      document.head.appendChild(s);
    });
  }
  return _stripeJsPromise;
}

export default function RigForge() {
  const [view, setView] = useState(() => { try { if (typeof window !== "undefined") { const h = window.location.hostname.split(".")[0]; const p = window.location.pathname.replace(/\/+$/, "").split("/").pop(); if (h === "pcmogger" || p === "admin" || p === "coadmin") return "mogger"; } } catch (e) {} return "home"; }); // home | survey | budget | results | mogger
  const [useCase, setUseCase] = useState(null);
  const [budget, setBudget] = useState(1200);
  const [parts, setParts] = useState(null);
  const [autoGen, setAutoGen] = useState(false); // true while showing an Auto-Forge build (regenerates on price changes)
  const [picker, setPicker] = useState(null); // category being swapped
  const [expanded, setExpanded] = useState({});
  const [saved, setSaved] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [nameDraft, setNameDraft] = useState("");
  const [savingOpen, setSavingOpen] = useState(false);
  const [view3D, setView3D] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [powerOpen, setPowerOpen] = useState(false);
  const [kwhRate, setKwhRate] = useState(0.13);
  const [hoursDay, setHoursDay] = useState(6);
  const [shareCopied, setShareCopied] = useState(false);
  const [toast, setToast] = useState(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [isFs, setIsFs] = useState(false);
  const [viewVisible, setViewVisible] = useState(true);
  const setViewAnimated = useCallback((nextView) => {
    setViewVisible(false);
    setTimeout(() => { setView(nextView); setViewVisible(true); }, 180);
  }, [setView]);
  const [priceInfo, setPriceInfo] = useState(null);
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== "undefined" ? navigator.onLine : true));
  const [offlinePriceStatus, setOfflinePriceStatus] = useState(null); // null | "cached" | "sample"
  useEffect(() => {
    const up = () => setIsOnline(true);
    const dn = () => setIsOnline(false);
    window.addEventListener("online", up); window.addEventListener("offline", dn);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", dn); };
  }, []);
  const [theme, setTheme] = useState("dark"); // default dark mode
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("appearance");
  const [hdrUser, setHdrUser] = useState(() => { try { const s = localStorage.getItem("mogger_user"); return s ? JSON.parse(s) : null; } catch (e) { return null; } });
  const [hdrAuth, setHdrAuth] = useState(false);
  const [hdrLogoutAsk, setHdrLogoutAsk] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState(null); // the tier object being purchased
  const [checkoutErr, setCheckoutErr] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);
  const [checkoutReady, setCheckoutReady] = useState(false);
  const checkoutInstanceRef = useRef(null); // { stripe, elements, subscriptionId }
  const [payBanner, setPayBanner] = useState(null); // { ok, text }
  const [lang, setLang] = useState("en");
  CUR_LANG = lang;
  const [showPatch, setShowPatch] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await sGet("rf:theme");
      if (t === "light" || t === "dark") setTheme(t);
    })();
  }, []);
  const changeTheme = (t) => { setTheme(t); sSet("rf:theme", t); setSettingsOpen(false); };
  useEffect(() => { (async () => { const l = await sGet("rf:lang"); if (l && LANGS.some((x) => x.code === l)) setLang(l); })(); }, []);
  const changeLang = (l) => { setLang(l); sSet("rf:lang", l); };

  useEffect(() => {
    if (!settingsOpen) return;
    const h = () => setSettingsOpen(false);
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [settingsOpen]);
  useEffect(() => {
    if (!moreOpen) return;
    const h = () => setMoreOpen(false);
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [moreOpen]);

  useEffect(() => {
    const h = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  // Pull live prices and override the built-in sample prices. Fails silently
  // (keeps sample prices) when the endpoint isn't reachable, e.g. inside Claude.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(PRICES_URL + "?t=" + Date.now(), { cache: "no-store" });
        if (!res.ok) throw new Error("not ok");
        const data = await res.json();
        if (cancelled || !data || !data.prices) return;
        let n = 0;
        for (const c of CATEGORY_ORDER) {
          for (const part of CATALOG[c]) {
            const entry = data.prices[part.id];
            // lowest price AND which store it came from.
            // Guard: ignore any scraped price wildly off the catalog baseline — that
            // means a wrong product got matched to this part (e.g. a $160 hit on a ~$400 GPU).
            const baseline = part.price;
            // Only guard the LOW side: reject prices well below baseline (a wrong, cheaper product
            // matched to this part). No upper cap — prices can legitimately spike (e.g. RAM shortage).
            const plausible = (v) => typeof v === "number" && v > 0 && (!baseline || v >= baseline * 0.5);
            let best = null, bestSrc = null;
            if (entry) {
              for (const [src, v] of Object.entries(entry)) {
                if (plausible(v) && (best == null || v < best)) { best = v; bestSrc = src; }
              }
            }
            if (best != null) { part.price = best; part._live = true; part._source = bestSrc; n++; }
            else { part._live = false; part._source = null; } // not in latest live data => out of stock
            // image + link must match the store of the displayed price.
            // Prefer the live scrape's media for that store; fall back to baked per-source media.
            const lm = (data.media && data.media[part.id]) || {};
            const pickSrc = (src) => {
              if (src === "newegg") {
                const live = lm.newegg && lm.newegg.url ? lm.newegg : null;
                return live || (MEDIA_NE && MEDIA_NE[part.id]) || null;
              }
              if (src === "amazon") {
                const live = lm.amazon && lm.amazon.url ? lm.amazon : null;
                return live || MEDIA[part.id] || null;
              }
              return null; // best buy etc. has no own product listing here
            };
            // chosen store = the price's store; if that store has no listing (e.g. best buy), fall back to amazon then newegg
            let chosen = pickSrc(bestSrc) || pickSrc("amazon") || pickSrc("newegg");
            if (chosen) { if (chosen.img) part.img = chosen.img; if (chosen.url) part.url = chosen.url; }
          }
        }
        PRICE_LIVE = n > 0; // only go "live" if we actually got real prices; empty feed => keep baseline, nothing marked out of stock
        setPriceInfo({ updatedAt: data.updatedAt, count: n });
        // Cache for offline use
        const ls = LS();
        if (ls && n > 0) {
          try { ls.setItem("forgeapc-price-cache", JSON.stringify(data)); ls.setItem("forgeapc-price-ts", Date.now().toString()); ls.setItem("forgeapc-ever-online", "1"); } catch (e) {}
        }
        setOfflinePriceStatus(null);
      } catch (e) {
        if (cancelled) return;
        // Offline or unreachable — try the most recent cached prices
        const ls = LS();
        const raw = ls && ls.getItem("forgeapc-price-cache");
        const everOnline = ls && ls.getItem("forgeapc-ever-online");
        if (raw) {
          try {
            const data = JSON.parse(raw);
            if (data && data.prices) {
              let n = 0;
              for (const c of CATEGORY_ORDER) {
                for (const part of CATALOG[c]) {
                  const entry = data.prices[part.id];
                  const baseline = part.price;
                  const plausible = (v) => typeof v === "number" && v > 0 && (!baseline || v >= baseline * 0.5);
                  let best = null, bestSrc = null;
                  if (entry) { for (const [src, v] of Object.entries(entry)) { if (plausible(v) && (best == null || v < best)) { best = v; bestSrc = src; } } }
                  if (best != null) { part.price = best; part._live = true; part._source = bestSrc; n++; }
                  else { part._live = false; part._source = null; }
                  const lm = (data.media && data.media[part.id]) || {};
                  const pickSrc = (src) => { if (src === "newegg") { const live = lm.newegg && lm.newegg.url ? lm.newegg : null; return live || (MEDIA_NE && MEDIA_NE[part.id]) || null; } if (src === "amazon") { const live = lm.amazon && lm.amazon.url ? lm.amazon : null; return live || MEDIA[part.id] || null; } return null; };
                  let chosen = pickSrc(bestSrc) || pickSrc("amazon") || pickSrc("newegg");
                  if (chosen) { if (chosen.img) part.img = chosen.img; if (chosen.url) part.url = chosen.url; }
                }
              }
              PRICE_LIVE = n > 0;
              const ts = ls && ls.getItem("forgeapc-price-ts");
              setPriceInfo({ updatedAt: data.updatedAt, count: n, fromCache: true, cacheTs: ts ? Number(ts) : null });
              setOfflinePriceStatus("cached");
            }
          } catch (e2) { setOfflinePriceStatus(everOnline ? "cached" : "sample"); }
        } else {
          setOfflinePriceStatus(everOnline ? "cached" : "sample");
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);
  const toggleFs = () => {
    try {
      if (!document.fullscreenElement) {
        const el = document.documentElement;
        const p = (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
        if (p && p.catch) p.catch(() => {});
      } else {
        (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
      }
    } catch (e) {}
  };

  const acct = () => { try { const s = localStorage.getItem("mogger_user"); return s ? JSON.parse(s) : null; } catch (e) { return null; } };
  useEffect(() => { setHdrUser(acct()); }, [view]);
  const hdrLogout = () => { try { localStorage.removeItem("mogger_user"); } catch (e) {} setHdrUser(null); };

  // Mount Stripe Payment Element (native card fields styled to match the app).
  useEffect(() => {
    if (!checkoutPlan) return;
    let cancelled = false;
    setCheckoutErr(""); setCheckoutLoading(true); setCheckoutReady(false);
    (async () => {
      try {
        const u = acct();
        const r = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ tier: checkoutPlan.key, email: u && u.email ? u.email : undefined }),
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok || !data.clientSecret || !data.publishableKey) throw new Error(data.error || (r.ok ? "Could not start checkout." : "Server error — make sure STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY are set in Vercel."));
        if (cancelled) return;
        const Stripe = await loadStripeJs();
        if (cancelled) return;
        const stripe = Stripe(data.publishableKey);
        const appearance = {
          theme: "night",
          variables: {
            colorPrimary: "#19e8db",
            colorBackground: "#0c1119",
            colorText: "#e2eaf4",
            colorTextSecondary: "#8aa0b4",
            colorDanger: "#ff5c72",
            fontFamily: "'Chakra Petch', sans-serif",
            borderRadius: "10px",
            spacingUnit: "4px",
          },
          rules: {
            ".Input": { border: "1px solid #1e2a3a", backgroundColor: "#070a0f" },
            ".Input:focus": { border: "1px solid #19e8db", boxShadow: "0 0 0 3px rgba(25,232,219,0.15)" },
            ".Label": { color: "#8aa0b4", fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase" },
            ".Error": { color: "#ff5c72" },
          },
        };
        const fonts = [{ cssSrc: "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&display=swap" }];
        const elements = stripe.elements({ clientSecret: data.clientSecret, appearance, fonts });
        const paymentEl = elements.create("payment", { layout: "tabs" });
        if (cancelled) return;
        checkoutInstanceRef.current = { stripe, elements, subscriptionId: data.subscriptionId };
        paymentEl.on("ready", () => { if (!cancelled) setCheckoutReady(true); });
        paymentEl.mount("#rf-payment-element");
        setCheckoutLoading(false);
      } catch (e) {
        if (!cancelled) { setCheckoutErr((e && e.message) || "Checkout failed."); setCheckoutLoading(false); }
      }
    })();
    return () => {
      cancelled = true;
      checkoutInstanceRef.current = null;
    };
  }, [checkoutPlan]);

  const closePlans = () => { setCheckoutPlan(null); setCheckoutErr(""); setCheckoutSubmitting(false); setPlansOpen(false); };

  const handlePay = async () => {
    const inst = checkoutInstanceRef.current;
    if (!inst) return;
    setCheckoutSubmitting(true); setCheckoutErr("");
    const origin = window.location.origin;
    const { error } = await inst.stripe.confirmPayment({
      elements: inst.elements,
      confirmParams: { return_url: origin + "/?checkout=return&subscription_id=" + encodeURIComponent(inst.subscriptionId) },
    });
    if (error) { setCheckoutErr(error.message || "Payment failed."); setCheckoutSubmitting(false); }
  };

  // After payment confirms, Stripe redirects back with ?checkout=return&subscription_id=...
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("checkout") !== "return") return;
      const sid = params.get("subscription_id");
      window.history.replaceState(null, "", window.location.pathname);
      if (!sid) return;
      (async () => {
        try {
          const r = await fetch("/api/create-checkout-session?subscription_id=" + encodeURIComponent(sid));
          const d = await r.json();
          if (r.ok && d.status === "active") setPayBanner({ ok: true, text: "Payment successful — your plan is active. Thank you!" });
          else if (r.ok && (d.status === "incomplete" || d.status === "past_due")) setPayBanner({ ok: false, text: "Checkout wasn't completed. You can try again anytime." });
          else setPayBanner({ ok: false, text: "We couldn't confirm the payment. If you were charged, contact support." });
        } catch (e) {
          setPayBanner({ ok: true, text: "Thanks! If your payment went through, your plan is now active." });
        }
      })();
    } catch (e) {}
  }, []);
  const refreshSaved = useCallback(async () => {
    setLoadingSaved(true);
    const keys = await sList("build:");
    let list = (await Promise.all(keys.map((k) => sGet(k)))).filter(Boolean);
    const u = acct();
    if (u && u.id) {
      try {
        const cloud = await netListBuilds(u.id);
        const byId = {};
        for (const b of list) byId[b.id] = b;
        for (const b of cloud) if (b && b.id && !byId[b.id]) byId[b.id] = b; // cloud-only builds appear too
        list = Object.values(byId);
      } catch (e) { /* offline: just local */ }
    }
    list.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
    setSaved(list);
    setLoadingSaved(false);
  }, []);
  useEffect(() => { refreshSaved(); }, [refreshSaved]);
  useEffect(() => { if (view === "home") refreshSaved(); }, [view, refreshSaved]);

  // Load shared build from URL hash
  useEffect(() => {
    try {
      const hash = window.location.hash.replace("#share=", "");
      if (hash && hash.length > 10) {
        const d = decodeBuild(hash);
        if (d && d.parts && d.useCase) {
          setUseCase(ensureUseCase(d.useCase));
          setBudget(d.budget || 1500);
          setParts(d.parts);
          setView("results");
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    } catch(e) {}
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "h") setView("home");
      if (e.key === "n") startSurvey();
      if (e.key === "c") setView("community");
      if (e.key === "p") setView("parts");
      if (e.key === "x") setView("compare");
      if (e.key === "m") setView("mogger");
      if (e.key === "d") setView("mogger");
      if (e.key === "s" && view === "results") setSavingOpen(true);
      if (e.key === "a" && view === "results") generateAuto();
      if (e.key === "Escape") { setSavingOpen(false); setPowerOpen(false); setView3D(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [view]);

  const analysis = useMemo(
    () => (parts && useCase ? analyzeBuild(parts, useCase, budget) : null),
    [parts, useCase, budget]
  );
  const verdict = useMemo(
    () => (parts && analysis ? generateVerdict(parts, analysis, useCase, budget) : ""),
    [parts, analysis, useCase, budget]
  );

  // AI scoring + verdict: a single /api/chat call returns the BUILD SCORE, the
  // PRICE/PERFORMANCE score AND the written verdict as JSON. It fires automatically
  // (debounced) once per finished, compatible build — the engine's numbers show
  // instantly as a fallback while it runs or if the API can't be reached.
  const [aiVerdict, setAiVerdict] = useState(null);
  const [aiBusy, setAiBusy] = useState(false);
  useEffect(() => { setAiVerdict(null); setAiBusy(false); }, [parts, useCase, budget, view]);
  const runVerdict = useCallback(async () => {
    if (!parts || !parts.cpu || !useCase || !analysis || aiBusy) return;
    if (!isOnline) { setAiVerdict("__offline__"); return; }
    setAiBusy(true); setAiVerdict(null);
    const summary = {
      useCase: USE_CASES[useCase].label,
      budget,
      buildTotal: analysis.total,
      withinBudget: analysis.total <= budget,
      performanceScore_of1000: analysis.score,
      pricePerformanceScore_of100: analysis.ppScore,
      compatible: analysis.compat.pass,
      parts: CATEGORY_ORDER.filter((c) => parts[c]).map((c) => {
        const band = (budget * USE_CASES[useCase].alloc[c]) / 100;
        const dp = describePart(c, parts[c]);
        const rawPower = dp.ratingOutOf100; delete dp.ratingOutOf100;
        return {
          slot: c,
          priceUSD: partOOS(parts[c]) ? "out of stock" : parts[c].price,
          matchScore_0to100: partScore({ ...parts[c], cat: c }, band, useCase),
          rawPowerVsBest_0to100: rawPower,
          ...dp,
        };
      }),
      compatibilityIssues: analysis.compat.issues && analysis.compat.issues.length ? analysis.compat.issues : "none",
    };
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          system: "You are a sharp PC-building advisor. You're given a build as JSON. For each part: matchScore_0to100 = how good a pick that part is for THIS build's budget and use case — this is the score shown to the user, where higher means a better choice; rawPowerVsBest_0to100 = its absolute power versus the most powerful possible part (a flagship ≈ 100), so a budget part naturally has a low number here and that is NOT a weakness. Also given: labeled specs, current prices, the build's performanceScore_of1000 (use-case-weighted real performance) and pricePerformanceScore_of100, budget, use case, and compatibility issues. When you describe how good a part is, use its matchScore — NEVER call a part low-scoring or weak because its rawPowerVsBest is low (e.g. a 9060 XT with matchScore 92 is an excellent pick even though its rawPowerVsBest is ~35). Write about 3 sentences (~55-70 words): how well the build fits the use case and budget, its main strength, and the genuine weakest link or bottleneck. Judge by real-world fit for the use case, NOT by raw spec numbers — do NOT call a normal mainstream spec (e.g. an 8GB GPU, 16GB RAM, a 1TB SSD) a flaw unless it truly bottlenecks the use case at this budget. Use ONLY the specs given — never invent a spec (e.g. read driveType for SATA vs NVMe). When judging the cooler, weigh coolerType and ratedForTdpWatts against the CPU's tdpWatts and cores: high-TDP or high-core chips (X3D, Ryzen 9, i7/i9, ~120W+) genuinely benefit from a strong air cooler or AIO — never call an AIO 'overkill' for those. Be specific; reference key parts by name. Plain prose only — no markdown, no lists, no preamble.",
          messages: [{ role: "user", content: "Here is the build as JSON:\n" + JSON.stringify(summary, null, 1) + "\n\nWrite the verdict." }],
        }),
      });
      if (res.ok) { const data = await res.json(); if (data && data.text) setAiVerdict(String(data.text).trim()); }
    } catch (e) { /* leave unset; button stays available to retry */ }
    finally { setAiBusy(false); }
  }, [parts, useCase, budget, analysis, aiBusy]);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const startSurvey = () => { setUseCase(null); setView("survey"); };
  const chooseUseCase = (sel) => { setUseCase(makeUseCase(Array.isArray(sel) ? sel : [sel])); setView("budget"); };
  const generateAuto = () => { setAutoGen(true); setParts(assembleBuild(useCase, budget)); setExpanded({}); setView("results"); };
  const startManual = () => { setAutoGen(false); setParts({}); setExpanded({}); setView("results"); };

  // Auto-Forge is never cached: whenever live prices arrive/refresh (or budget/use-case
  // change), rebuild on the spot from current prices, skipping out-of-stock parts.
  // Stops as soon as the user manually edits the build, so their picks aren't overwritten.
  useEffect(() => {
    if (autoGen && useCase) setParts(assembleBuild(useCase, budget));
  }, [priceInfo, autoGen, useCase, budget]);

  const swapPart = (cat, part) => {
    setAutoGen(false);
    setParts((p) => ({ ...p, [cat]: part }));
    setPicker(null);
  };
  const removePart = (cat) => { setAutoGen(false); setParts((p) => { const n = { ...p }; delete n[cat]; return n; }); };

  const saveBuild = async () => {
    const a = analyzeBuild(parts, useCase, budget);
    const build = {
      id: "b" + Date.now(),
      name: nameDraft.trim() || `${USE_CASES[useCase].label} Build`,
      note: noteDraft.trim(),
      useCase, budget, parts,
      total: a.total, overallScore: a.score, ppScore: a.ppScore, // frozen on save
      verdict: generateVerdict(parts, a, useCase, budget),
      compatPass: a.compat.pass,
      savedAt: Date.now(),
    };
    await sSet("build:" + build.id, build);
    const u = acct(); if (u && u.id) await netSyncBuild(u.id, build);
    setSavingOpen(false); setNameDraft(""); setNoteDraft("");
    await refreshSaved();
    flash(u ? "Build saved to your account" : "Build saved to your rigs");
    setView("home");
  };
  const deleteBuild = async (id) => { await sDel("build:" + id); const u = acct(); if (u && u.id) await netDeleteBuild(u.id, id); await refreshSaved(); };
  // Save a build that came from somewhere else (e.g. a PC Mogger match) into My Rigs.
  const saveExternalBuild = async (partsMap, ucKey, bud, name) => {
    const uc = ensureUseCase(ucKey);
    const a = analyzeBuild(partsMap, uc, bud);
    const build = {
      id: "b" + Date.now() + Math.floor(Math.random() * 1000),
      name: name || `${USE_CASES[uc].label} Build`,
      useCase: uc, budget: bud, parts: partsMap,
      total: a.total, overallScore: a.score, ppScore: a.ppScore,
      verdict: generateVerdict(partsMap, a, uc, bud),
      compatPass: a.compat.pass, savedAt: Date.now(),
    };
    await sSet("build:" + build.id, build);
    const u = acct(); if (u && u.id) await netSyncBuild(u.id, build);
    await refreshSaved();
    return true;
  };
  const openSaved = (b) => { setAutoGen(false); setUseCase(ensureUseCase(b.useCase)); setBudget(b.budget); setParts(b.parts); setView("results"); };

  return (
    <div className={"rf-root" + (theme === "light" ? " rf-light" : "")} dir={lang === "ar" ? "rtl" : "ltr"}>
      <StyleBlock />
      <div className="rf-bg" />
      <div className="rf-grid" />
      <ParticleField />
      {!isOnline && <OfflineBanner offlinePriceStatus={offlinePriceStatus} priceInfo={priceInfo} />}
      {!isOnline && <div style={{height:"38px"}} />}

      <header className="rf-header">
        <div className="rf-brand" onClick={() => setViewAnimated("home")}>
          <div className="rf-logo"><Zap size={18} /></div>
          <span>FORGE<span className="rf-accent">APC</span></span>
        </div>
        <div className="rf-header-right">
          {view !== "home" && (
            <button className="rf-ghost" onClick={() => setViewAnimated("home")}>
              <ChevronLeft size={16} /> {t("myRigs")}
            </button>
          )}
          <div className="rf-settings-wrap" style={{position:"relative"}}>
            <button className="rf-ghost rf-plans-btn" onClick={(e) => { e.stopPropagation(); setMoreOpen(o => !o); setSettingsOpen(false); }}>
              ☰ More
            </button>
            {moreOpen && (
              <div className="rf-settings-menu rf-more-menu" style={{minWidth:"180px",right:0,top:"calc(100% + 6px)"}} onClick={(e) => e.stopPropagation()}>
                <button className="rf-lang-opt" onClick={() => { setView("community"); setMoreOpen(false); }}><Users size={14} /> Community</button>
                <button className="rf-lang-opt" onClick={() => { setView("parts"); setMoreOpen(false); }}><PackageSearch size={14} /> Parts</button>
                <button className="rf-lang-opt" onClick={() => { setView("compare"); setMoreOpen(false); }}><Columns2 size={14} /> Compare</button>
                <button className="rf-lang-opt" onClick={() => { setView("calendar"); setMoreOpen(false); }}><LayoutGrid size={14} /> Launches</button>
                <button className="rf-lang-opt" onClick={() => { setView("analyze"); setMoreOpen(false); }}><Zap size={14} /> Analyze Build</button>
                <button className="rf-lang-opt" onClick={() => { setView("tools"); setMoreOpen(false); }}><DollarSign size={14} /> Cost Tools</button>
                <div style={{height:"1px",background:"var(--c-border)",margin:"4px 0"}}/>
                <button className="rf-lang-opt" onClick={() => { setView("fps-games"); setMoreOpen(false); }}>🎮 FPS &amp; Games</button>
                <button className="rf-lang-opt" onClick={() => { setView("build-stats"); setMoreOpen(false); }}>🏆 Build Stats</button>
                <button className="rf-lang-opt" onClick={() => { setView("power-peripherals"); setMoreOpen(false); }}>🔋 Power &amp; Peripherals</button>
                <button className="rf-lang-opt" onClick={() => { setView("export-more"); setMoreOpen(false); }}>📁 Export &amp; More</button>
              </div>
            )}
          </div>
          <button className="rf-ghost rf-plans-btn" onClick={() => setShowPatch(true)}>✨ What's New</button>
          <button className="rf-ghost rf-plans-btn" onClick={() => setPlansOpen(true)}><Sparkles size={15} /> Plans</button>
          {hdrUser ? (
            <>
              {hdrUser.name === "Rayaan" && (
                <button className="rf-ghost rf-admin-btn" onClick={() => setView("mogger-admin")} title="Admin panel">⚙️ Admin</button>
              )}
              {["kareem","nik","jahan"].includes(hdrUser.name.toLowerCase()) && (
                <button className="rf-ghost rf-admin-btn" onClick={() => setView("mogger-coadmin")} title="Co-Admin panel">🛡️ Co-Admin</button>
              )}
              <div className="rf-acct-chip">
                <span className="rf-acct-name">{hdrUser.name}</span>
                <RankBadges elo={hdrUser.elo} custom={hdrUser.crank} />
                {typeof hdrUser.elo === "number" && (() => { const r = moggerRank(hdrUser.elo, hdrUser.crank); return <span className="rf-hdr-elo" style={{"--rank-color": r.color}}>{hdrUser.elo}</span>; })()}
                <button className="rf-acct-out" onClick={() => setHdrLogoutAsk(true)} title="Log out"><X size={13} /></button>
              </div>
            </>
          ) : (
            <button className="rf-ghost rf-login-btn" onClick={() => setHdrAuth(true)}>Log in</button>
          )}
          <div className="rf-settings-wrap">
            <button className="rf-ghost rf-fs-btn" onClick={(e) => { e.stopPropagation(); setSettingsOpen((o) => !o); }} title="Settings"><Settings size={16} /></button>
            {settingsOpen && (
              <div className="rf-settings-menu" onClick={(e) => e.stopPropagation()}>
                <div className="rf-settings-tabs">
                  <button className={"rf-settings-tab" + (settingsTab === "appearance" ? " active" : "")} onClick={() => setSettingsTab("appearance")}>{t("appearance")}</button>
                  <button className={"rf-settings-tab" + (settingsTab === "language" ? " active" : "")} onClick={() => setSettingsTab("language")}>{t("language")}</button>
                </div>
                {settingsTab === "appearance" ? (
                  <div className="rf-settings-pane">
                    <div className="rf-settings-title">{t("theme")}</div>
                    <div className="rf-theme-toggle">
                      <button className={"rf-theme-opt" + (theme === "dark" ? " active" : "")} onClick={() => changeTheme("dark")}><Moon size={14} /> {t("dark")}</button>
                      <button className={"rf-theme-opt" + (theme === "light" ? " active" : "")} onClick={() => changeTheme("light")}><Sun size={14} /> {t("light")}</button>
                    </div>
                  </div>
                ) : (
                  <div className="rf-settings-pane">
                    <div className="rf-settings-title">{t("language")}</div>
                    <div className="rf-lang-list">
                      {LANGS.map((L) => (
                        <button key={L.code} className={"rf-lang-opt" + (lang === L.code ? " active" : "")} onClick={() => changeLang(L.code)}>
                          <span>{L.name}</span>{lang === L.code && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <button className="rf-ghost rf-fs-btn" onClick={toggleFs} title={isFs ? "Exit full screen" : "Full screen"}>
            {isFs ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </header>

      {hdrAuth && <MoggerAuth onClose={() => setHdrAuth(false)} onAuth={(u) => { try { localStorage.setItem("mogger_user", JSON.stringify(u)); } catch (e) {} setHdrUser(u); setHdrAuth(false); }} />}
      {payBanner && (
        <div className="rf-pay-banner" style={payBanner.ok ? {} : { background: "linear-gradient(135deg,#ff8a5c,#e23a52)", color: "#fff" }}>
          {payBanner.ok ? <Check size={18} /> : <AlertTriangle size={18} />} {payBanner.text}
          <button onClick={() => setPayBanner(null)} title="Dismiss"><X size={14} /></button>
        </div>
      )}
      {plansOpen && (
        <div className="rf-modal-overlay" onClick={closePlans}>
          <div className="rf-plans" onClick={(e) => e.stopPropagation()}>
            <button className="rf-plans-x" onClick={closePlans} title="Close"><X size={18} /></button>
            {checkoutPlan ? (
              <div className="rf-checkout">
                <button className="rf-checkout-back" onClick={() => { setCheckoutPlan(null); setCheckoutErr(""); setCheckoutSubmitting(false); }}><ChevronLeft size={16} /> Back to plans</button>
                <h2 className="rf-plans-title"><span className="rf-hero-grad">{checkoutPlan.name} — ${checkoutPlan.price}/mo</span></h2>
                {checkoutLoading && <div className="rf-checkout-loading"><div className="pm-spinner" /> Setting up payment…</div>}
                {checkoutErr && <div className="rf-checkout-err">{checkoutErr}</div>}
                <div className="rf-payment-form">
                  <div id="rf-payment-element" />
                  {checkoutReady && (
                    <button className="rf-btn rf-pay-btn" onClick={handlePay} disabled={checkoutSubmitting}>
                      {checkoutSubmitting ? <><div className="pm-spinner" /> Processing…</> : <>Pay ${checkoutPlan.price}/mo</>}
                    </button>
                  )}
                </div>
                <p className="rf-checkout-fine">🔒 Secured by Stripe · cancel anytime</p>
              </div>
            ) : (<>
              <h2 className="rf-plans-title"><span className="rf-hero-grad">Choose your plan</span></h2>
              <p className="rf-plans-sub">Upgrade for more power. Cancel anytime.</p>
              <div className="rf-plans-grid">
                {[
                  { key: "free", name: "Free", price: 0, tag: "", perks: ["Unlimited PC builds", "Full PC Duels access", "Save rigs to this device"] },
                  { key: "plus", name: "Plus", price: 2, tag: "", perks: ["Everything in Free", "Ad-free experience", "Cloud-synced saves", "Custom rank color"] },
                  { key: "pro", name: "Pro", price: 5, tag: "Popular", perks: ["Everything in Plus", "Custom rank icon", "Priority price updates", "Early access to features"] },
                  { key: "max", name: "Max", price: 8, tag: "", perks: ["Everything in Pro", "Exclusive supporter badge", "Beta features first", "Support the developer"] },
                ].map((p) => (
                  <div key={p.key} className={"rf-plan" + (p.tag ? " rf-plan-feat" : "")}>
                    {p.tag && <span className="rf-plan-tag">{p.tag}</span>}
                    <div className="rf-plan-name">{p.name}</div>
                    <div className="rf-plan-price"><span className="rf-plan-amt">${p.price}</span><span className="rf-plan-per">/mo</span></div>
                    <ul className="rf-plan-perks">
                      {p.perks.map((x, i) => (<li key={i}><Check size={14} /> {x}</li>))}
                    </ul>
                    <button className={"rf-plan-cta" + (p.price === 0 ? " rf-plan-cta-free" : "")} disabled={p.price === 0} onClick={() => { if (p.price !== 0) { setCheckoutErr(""); setCheckoutPlan(p); } }}>{p.price === 0 ? "Current plan" : "Get " + p.name}</button>
                  </div>
                ))}
              </div>
            </>)}
          </div>
        </div>
      )}
      {hdrLogoutAsk && (
        <div className="rf-modal-overlay" onClick={() => setHdrLogoutAsk(false)}>
          <div className="rf-confirm" onClick={(e) => e.stopPropagation()}>
            <h3 className="rf-confirm-title">Log out?</h3>
            <p className="rf-confirm-msg">Are you sure you want to log out?</p>
            <div className="rf-confirm-btns">
              <button className="rf-confirm-yes" onClick={() => { hdrLogout(); setHdrLogoutAsk(false); }}>Yes, log out</button>
              <button className="rf-confirm-no" onClick={() => setHdrLogoutAsk(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      <main className={"rf-main rf-view-fade" + (viewVisible ? " rf-view-visible" : "")}>
        {view === "home" && (
          <Home saved={saved} loading={loadingSaved} onNew={startSurvey} onOpen={openSaved} onDelete={deleteBuild} priceInfo={priceInfo} onMogger={() => setView("mogger")}
            onClone={async (b) => {
              const clone = { ...b, id: "b" + Date.now(), name: b.name + " (Copy)", savedAt: Date.now() };
              await sSet("build:" + clone.id, clone);
              await refreshSaved();
              flash("Build cloned!");
            }}
          />
        )}
        {view === "community" && <CommunityBuilds user={hdrUser} onLogin={() => setHdrAuth(true)} onBack={() => setView("home")} />}
        {view === "parts" && <PartsExplorer onBack={() => setView("home")} />}
        {view === "compare" && <CompareBuilds saved={saved} onBack={() => setView("home")} />}
        {view === "calendar" && <LaunchCalendar />}
        {view === "analyze" && <AnalyzeView parts={parts} analysis={analysis} useCase={useCase} onBack={() => setView(parts ? "results" : "home")} saved={saved} onPickSaved={(b) => { setUseCase(b.useCase); setBudget(b.budget); setParts(b.parts); }} />}
        {view === "tools" && <ToolsView parts={parts} analysis={analysis} useCase={useCase} budget={budget} onBack={() => setView(parts ? "results" : "home")} saved={saved} onPickSaved={(b) => { setUseCase(b.useCase); setBudget(b.budget); setParts(b.parts); }} />}
        {view === "fps-games" && <FpsGamesView parts={parts} onBack={() => setView(parts ? "results" : "home")} saved={saved} onPickSaved={(b) => { setUseCase(b.useCase); setBudget(b.budget); setParts(b.parts); }} />}
        {view === "build-stats" && <BuildStatsView parts={parts} analysis={analysis} useCase={useCase} onBack={() => setView(parts ? "results" : "home")} saved={saved} onPickSaved={(b) => { setUseCase(b.useCase); setBudget(b.budget); setParts(b.parts); }} />}
        {view === "power-peripherals" && <PowerPeripheralsView parts={parts} useCase={useCase} onBack={() => setView(parts ? "results" : "home")} saved={saved} onPickSaved={(b) => { setUseCase(b.useCase); setBudget(b.budget); setParts(b.parts); }} />}
        {view === "export-more" && <ExportMoreView parts={parts} analysis={analysis} useCase={useCase} budget={budget} onBack={() => setView(parts ? "results" : "home")} saved={saved} onPickSaved={(b) => { setUseCase(b.useCase); setBudget(b.budget); setParts(b.parts); }} />}
        {view === "mogger" && <MoggerGame onExit={() => setView("home")} onSaveBuild={saveExternalBuild} />}
        {view === "mogger-admin" && <MoggerAdmin onBack={() => setView("home")} user={hdrUser} />}
        {view === "mogger-coadmin" && <MoggerCoAdmin onBack={() => setView("home")} bypass={true} />}
        {view === "survey" && <Survey onPick={chooseUseCase} />}
        {view === "budget" && (
          <BudgetStep useCase={useCase} budget={budget} setBudget={setBudget} onBack={() => setView("survey")} onAuto={generateAuto} onManual={startManual} />
        )}
        {view === "results" && parts && analysis && (
          <Results
            useCase={useCase} budget={budget} parts={parts} analysis={analysis} verdict={aiVerdict} aiBusy={aiBusy} onGenerate={runVerdict} isOnline={isOnline}
            expanded={expanded} setExpanded={setExpanded}
            onSwap={(c) => setPicker(c)} onRemove={removePart}
            onRegen={generateAuto} onSave={() => setSavingOpen(true)}
            onShare={hdrUser ? async (title) => {
              const a = analysis;
              await netPostCommunity(hdrUser.id, hdrUser.name, { title, useCase, budget, total: a.spend, perfScore: a.perf, parts });
            } : null}
            onShareLogin={() => setHdrAuth(true)}
            on3D={() => setView3D(true)}
            onAnalyze={() => setView("analyze")}
            onTools={() => setView("tools")}
            onNavigate={(v) => setView(v)}
            onPower={() => setPowerOpen(true)}
            onShareLink={() => {
              const enc = encodeBuild(useCase, budget, parts);
              if (enc) { navigator.clipboard.writeText(window.location.origin + window.location.pathname + "#share=" + enc); setShareCopied(true); setTimeout(() => setShareCopied(false), 2500); }
            }}
            shareCopied={shareCopied}
          />
        )}
      </main>

      {showPatch && (
        <div className="rf-modal-wrap" onClick={() => setShowPatch(false)}>
          <div className="rf-modal rf-patch-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rf-modal-head" style={{justifyContent:"space-between"}}>
              <span>✨ What's New in ForgeAPC</span>
              <button className="rf-icon-btn" onClick={() => setShowPatch(false)}><X size={16} /></button>
            </div>
            <div className="rf-patch-list">
              <div className="rf-patch-entry"><span className="rf-patch-ver">v2.8</span><span className="rf-patch-date">Jun 2026</span><ul><li>PC Duels: Draft Mode Duel — snake-draft from a shared 5-part pool per category; deny the AI's best picks</li><li>PC Duels: Spectator Betting Market — wager in-app coins on the outcome with dynamic ELO-based odds</li><li>PC Duels: Rogue Run — 5 escalating AI stages (350→2400 ELO) with permanent passive perks on each clear</li><li>PC Duels: Build Archaeology — community builds grouped by month, replay any as a Ghost Duel</li><li>PC Duels: Collaborative Syndicate Builds — 3–5 players each claim one PC category, in-app chat, team build vs AI</li><li>PC Duels: Adversarial Component Bans — ban 2 AI parts before the duel; AI retaliates</li><li>PC Duels: Faction Wars now weekly with contribution-based ELO rewards</li></ul></div>
              <div className="rf-patch-entry"><span className="rf-patch-ver">v2.7</span><span className="rf-patch-date">Jun 2026</span><ul><li>PC Duels: Ghost Duel Replay — challenge any past build, the opponent replays its real parts move-by-move</li><li>PC Duels: Meta Shift Alerts — flags when the catalog's optimal pick for a category changes</li><li>PC Duels: Build Archetype Classifier — flavor badges like Budget Slayer, Thermal Monster, Glass Cannon</li><li>PC Duels: Faction Wars — monthly Intel vs AMD / Air vs Liquid event with a live dominance bar</li><li>PC Duels: Constraint Gauntlet — daily solo score-attack under a rotating hard constraint, own leaderboard</li><li>PC Duels: Build Mentor AI — after a loss, the single component swap that would have moved the score the most</li></ul></div>
              <div className="rf-patch-entry"><span className="rf-patch-ver">v2.6</span><span className="rf-patch-date">Jun 2026</span><ul><li>PC Duels: Best-of-3 series mode against the same opponent</li><li>PC Duels: Win-streak ELO bonus multiplier (+10% per streak level, capped at +50%)</li><li>PC Duels: Radar-chart breakdown comparing both builds across gaming/productivity/value/efficiency/balance</li><li>PC Duels: "Avenge the Rival" instant rematch against a tier you have a losing record vs</li><li>PC Duels: Prominent Quick Rematch button in practice mode</li><li>PC Duels: Live build-pacing bar during Speed Duel showing budget spend vs time elapsed</li></ul></div>
              <div className="rf-patch-entry"><span className="rf-patch-ver">v2.5</span><span className="rf-patch-date">Jun 2026</span><ul><li>PC Duels: Match replay — re-watch any past duel part-by-part</li><li>PC Duels: Pre-match taunt picker</li><li>PC Duels: Confetti on win, Sudden Death mode, Mirror Match</li><li>PC Duels: Daily Challenge, achievement badges, build efficiency medal</li><li>My Rigs: Clone build, search, pin/favorite, build notes, completeness ring</li><li>Analyze: Noise estimate, weight estimate, streaming quality card, upgrade path</li><li>Analyze: Streaming &amp; LAN setup checklists</li><li>Tools: Monthly cost planner, cashback &amp; tax calculator</li><li>Share: Copy build as text or URL, share duel result</li><li>Parts: Sale badges in PC Duels picker</li><li>Shortcuts: Press D to jump to PC Duels</li></ul></div>
              <div className="rf-patch-entry"><span className="rf-patch-ver">v2.4</span><span className="rf-patch-date">Apr 2026</span><ul><li>Online multiplayer with real-time matchmaking</li><li>Global elo leaderboard</li><li>Ranked crank titles (Rookie → God Tier)</li><li>AI judge verdict after every duel</li></ul></div>
              <div className="rf-patch-entry"><span className="rf-patch-ver">v2.3</span><span className="rf-patch-date">Feb 2026</span><ul><li>3D build preview</li><li>Live price feeds</li><li>Streaming &amp; content creator use-case</li></ul></div>
            </div>
          </div>
        </div>
      )}

      {picker && (
        <Picker
          cat={picker} current={parts[picker]} useCase={useCase} budget={budget} parts={parts}
          onClose={() => setPicker(null)} onPick={(p) => swapPart(picker, p)}
        />
      )}

      {view3D && parts && (
        <div className="rf-modal-wrap rf-3d-wrap" onClick={() => setView3D(false)}>
          <div className="rf-modal rf-3d-modal" onClick={e => e.stopPropagation()}>
            <div className="rf-modal-head" style={{justifyContent:"space-between"}}>
              <span>3D Build Preview</span>
              <button className="rf-icon-btn" onClick={() => setView3D(false)}><X size={16} /></button>
            </div>
            <React.Suspense fallback={<div style={{height:"420px",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--c-muted)"}}>Loading 3D viewer…</div>}>
              <BuildViewer3D parts={parts} useCase={useCase} />
            </React.Suspense>
          </div>
        </div>
      )}

      {savingOpen && (
        <div className="rf-modal-wrap" onClick={() => setSavingOpen(false)}>
          <div className="rf-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Name this rig</h3>
            <p className="rf-muted">It'll show up on your front page with its frozen scores.</p>
            <input
              className="rf-input" autoFocus value={nameDraft}
              placeholder={`${USE_CASES[useCase].label} Build`}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveBuild()}
            />
            <textarea
              className="rf-input" value={noteDraft} rows={2}
              placeholder="Add a note (optional)…"
              onChange={(e) => setNoteDraft(e.target.value)}
              style={{resize:"vertical",marginTop:"8px"}}
            />
            <div className="rf-modal-actions">
              <button className="rf-ghost" onClick={() => setSavingOpen(false)}>Cancel</button>
              <button className="rf-btn" onClick={saveBuild}><Save size={16} /> {t("saveRig")}</button>
            </div>
          </div>
        </div>
      )}

      {powerOpen && parts && (
        <div className="rf-modal-wrap" onClick={() => setPowerOpen(false)}>
          <div className="rf-modal" onClick={e => e.stopPropagation()}>
            <div className="rf-modal-head">⚡ Power Cost Estimator</div>
            <div className="rf-power-grid">
              <label className="rf-muted" style={{fontSize:"0.83rem"}}>Electricity rate ($/kWh)</label>
              <input className="rf-input" type="number" step="0.01" min="0.01" max="1" value={kwhRate} onChange={e => setKwhRate(Number(e.target.value))} />
              <label className="rf-muted" style={{fontSize:"0.83rem"}}>Hours used per day</label>
              <input className="rf-input" type="number" step="1" min="1" max="24" value={hoursDay} onChange={e => setHoursDay(Number(e.target.value))} />
            </div>
            <div className="rf-power-result">
              <div><span className="rf-muted" style={{fontSize:"0.85rem"}}>Est. load</span><strong>{Math.round(requiredWatts(parts) * 0.75)}W</strong></div>
              <div><span className="rf-muted" style={{fontSize:"0.85rem"}}>Monthly cost</span><strong style={{color:"var(--c-accent)",fontSize:"1.4rem"}}>${powerCostMonthly(parts, kwhRate, hoursDay).toFixed(2)}</strong></div>
              <div><span className="rf-muted" style={{fontSize:"0.85rem"}}>Yearly cost</span><strong>${(powerCostMonthly(parts, kwhRate, hoursDay) * 12).toFixed(2)}</strong></div>
            </div>
            <p className="rf-muted" style={{fontSize:"0.75rem",marginTop:"0.5rem"}}>Estimate based on 75% average load, {hoursDay}h/day at ${kwhRate}/kWh.</p>
            <div className="rf-modal-row"><button className="rf-btn" onClick={() => setPowerOpen(false)}>Done</button></div>
          </div>
        </div>
      )}

      {!assistantOpen && view !== "mogger" && (
        <button className="rf-fab" onClick={() => setAssistantOpen(true)}>
          <Sparkles size={18} /> Ask AI
        </button>
      )}
      {view !== "mogger" && <Assistant open={assistantOpen} onClose={() => setAssistantOpen(false)} useCase={useCase} budget={budget} parts={parts} isOnline={isOnline} />}

      {toast && <div className="rf-toast"><Check size={15} /> {toast}</div>}
    </div>
  );
}

/* ----------------------------- HOME ----------------------------- */
/* ============================================================
   PC MOGGER — build-off mini-game (add-on). Reuses the live CATALOG,
   USE_CASES, CAT_META, prices and images from FORGEAPC.
   ============================================================ */
const MOGGER_BUDGETS = [800, 1000, 1200, 1500, 1800, 2200, 2800, 3500];
const MOGGER_UCS = ["gaming", "content", "streaming", "workstation", "ai", "office"];
const mRand = (a) => a[Math.floor(Math.random() * a.length)];

/* ----------------------------- CONSTRAINT GAUNTLET ----------------------------- */
// Solo daily score-attack: build under a rotating hard constraint. Violating it zeroes
// the score, same mechanism as an incompatible build or going over budget.
const GAUNTLET_CONSTRAINTS = [
  { id: "gpu-300", label: "No GPU over $300", violates: (b) => !!(b.gpu && b.gpu.price > 300) },
  { id: "tdp-65", label: "CPU TDP cap: 65W", violates: (b) => !!(b.cpu && b.cpu.tdp > 65) },
  { id: "itx-only", label: "ITX only", violates: (b) => !!(b.mobo && b.mobo.form !== "ITX") },
  { id: "no-gpu", label: "No discrete GPU — iGPU only", violates: (b) => !!b.gpu },
  { id: "ram-32", label: "RAM cap: 32GB", violates: (b) => !!(b.ram && b.ram.cap > 32) },
  { id: "stock-cooler", label: "Cooler budget: $40 max", violates: (b) => !!(b.cooler && b.cooler.price > 40) },
  { id: "air-only", label: "Air cooling only — no AIOs", violates: (b) => !!(b.cooler && b.cooler.type === "aio") },
];
function dailyGauntlet() {
  const d = new Date(); const dayKey = d.toISOString().slice(0, 10);
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const constraint = GAUNTLET_CONSTRAINTS[(seed + 7) % GAUNTLET_CONSTRAINTS.length];
  // "no-gpu" only pairs with a use case that doesn't require a discrete GPU — otherwise
  // the build is permanently incomplete and the day is unwinnable no matter the skill.
  const useCase = constraint.id === "no-gpu" ? "office" : MOGGER_UCS[(seed + 3) % MOGGER_UCS.length];
  const budget = MOGGER_BUDGETS[(seed + 5) % MOGGER_BUDGETS.length];
  return { dayKey, constraint, useCase, budget, secs: 150 };
}
// Same shape as moggerScore(), but a constraint violation zeroes the build like any other issue.
function gauntletScore(build, ucKey, budget, constraint) {
  const s = moggerScore(build, ucKey, budget);
  if (constraint && constraint.violates(build) && s.issues.length === 0) {
    return { ...s, total: 0, issues: ["Constraint violated: " + constraint.label] };
  }
  return s;
}

// deduped, cheapest-per-model options for a category (uses live prices)
function moggerOptions(cat) {
  const pool = CATALOG[cat];
  // Only parts with REAL (live) prices are stocked. Sample-priced parts are out of stock —
  // unless the whole category has zero live prices, then fall back to sample so the game stays playable.
  const live = PRICE_LIVE ? pool.filter((p) => p._live === true) : pool;
  const usable = live.length ? live : pool;
  const byModel = {};
  for (const p of usable) {
    const k = p.model || p.name;
    if (!byModel[k] || p.price < byModel[k].price) byModel[k] = p;
  }
  return Object.values(byModel).sort((a, b) => a.price - b.price);
}
// Picker display list: includes out-of-stock models (flagged _oos) so the player sees them greyed out.
function moggerOptionsAll(cat) {
  const byModel = {};
  for (const p of CATALOG[cat]) {
    const oos = partOOS(p);
    const k = p.model || p.name;
    const cur = byModel[k];
    if (!cur) { byModel[k] = { p, oos }; continue; }
    if (cur.oos && !oos) { byModel[k] = { p, oos }; continue; } // in-stock beats out-of-stock
    if (cur.oos === oos && p.price < cur.p.price) byModel[k] = { p, oos };
  }
  const list = Object.values(byModel);
  const allOOS = list.length > 0 && list.every((e) => e.oos);
  // whole category out of stock => sample fallback (matches moggerOptions)
  return list.map((e) => ({ ...e.p, _oos: allOOS ? false : e.oos })).sort((a, b) => a.price - b.price);
}
function mEstDraw(b) { let d = 90; if (b.cpu) d += b.cpu.tdp || 65; if (b.gpu) d += b.gpu.tdp || 0; return d; }

// A1: Win confetti burst — pure canvas, no library
function ConfettiBurst({ active }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const COLORS = ["#1ff5e6","#a07aff","#ffd700","#ff6b6b","#7fff7f","#fff"];
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.4 - 50,
      vx: (Math.random() - 0.5) * 5,
      vy: Math.random() * 3 + 1,
      rot: Math.random() * Math.PI * 2,
      rsp: (Math.random() - 0.5) * 0.15,
      w: Math.random() * 8 + 4,
      h: Math.random() * 5 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
    }));
    const start = performance.now();
    let raf;
    const draw = (now) => {
      const elapsed = now - start;
      const fade = Math.max(0, 1 - (elapsed - 1800) / 700);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.rot += p.rsp; p.vy += 0.05;
        ctx.save();
        ctx.globalAlpha = fade * Math.min(1, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (elapsed < 2500) raf = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    raf = requestAnimationFrame(draw);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [active]);
  if (!active) return null;
  return <canvas ref={canvasRef} style={{ position:"fixed", top:0, left:0, pointerEvents:"none", zIndex:9999 }} />;
}

// A2: ELO ticker — animates from old to new ELO over 1.2s
function EloTicker({ oldElo, newElo, delta }) {
  const [displayed, setDisplayed] = useState(oldElo);
  useEffect(() => {
    if (oldElo === newElo) return;
    const dur = 1200, t0 = performance.now();
    let raf;
    const tick = (now) => {
      const f = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - f, 3);
      setDisplayed(Math.round(oldElo + (newElo - oldElo) * e));
      if (f < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [oldElo, newElo]);
  return <span className={"pm-elo-ticker" + (delta > 0 ? " up" : delta < 0 ? " down" : "")}>{displayed}</span>;
}

// A4: Score breakdown bar chart
function ScoreBarChart({ you, opp, youLabel, oppName, useCase, budget }) {
  const cats = CATEGORY_ORDER.filter((c) => (USE_CASES[useCase]?.alloc?.[c] || 0) > 0);
  const sy = moggerScore(you, useCase, budget);
  const so = moggerScore(opp, useCase, budget);
  return (
    <div className="pm-score-bars">
      <div className="pm-score-bars-title">Score contribution by category</div>
      {cats.map((c) => {
        const alloc = USE_CASES[useCase].alloc[c] || 0;
        const maxP = ucMaxPerf(c, useCase);
        const yPct = you[c] && maxP ? Math.round(ucPerf(c, you[c], useCase) / maxP * 100) : 0;
        const oPct = opp[c] && maxP ? Math.round(ucPerf(c, opp[c], useCase) / maxP * 100) : 0;
        const yContrib = Math.round(yPct * alloc / 100);
        const oContrib = Math.round(oPct * alloc / 100);
        const maxContrib = alloc;
        return (
          <div key={c} className="pm-score-bar-row">
            <span className="pm-score-bar-label">{CAT_META[c].label}<span className="pm-score-bar-alloc"> {alloc}%</span></span>
            <div className="pm-score-bar-tracks">
              <div className="pm-score-bar-track">
                <div className="pm-score-bar-fill you" style={{ width: maxContrib > 0 ? (yContrib / maxContrib * 100) + "%" : "0%" }} />
                <span className="pm-score-bar-val">{yContrib}</span>
              </div>
              <div className="pm-score-bar-track opp">
                <div className="pm-score-bar-fill opp" style={{ width: maxContrib > 0 ? (oContrib / maxContrib * 100) + "%" : "0%" }} />
                <span className="pm-score-bar-val">{oContrib}</span>
              </div>
            </div>
          </div>
        );
      })}
      <div className="pm-score-bar-legend">
        <span className="pm-score-bar-leg-you">{youLabel}</span>
        <span className="pm-score-bar-leg-opp">{oppName}</span>
      </div>
    </div>
  );
}

function moggerScore(build, ucKey, budget) {
  // Runs on the same engine FORGEAPC uses: checkCompat + use-case-normalized
  // performance (analyzeBuild). Mogger rule on top: any issue OR missing part = 0.
  const a = analyzeBuild(build, ucKey, budget);
  // Office legitimately skips a discrete GPU — don't penalise for it
  const _need = CATEGORY_ORDER.filter((c) => !(c === "gpu" && USE_CASES[ucKey]?.alloc?.gpu === 0));
  const filled = _need.filter((c) => build[c]).length;
  const issues = [...a.compat.issues];
  if (filled < _need.length) issues.push("Build is incomplete — missing parts");
  const spend = a.total, over = spend > budget, overBy = Math.max(0, spend - budget);
  const perfPct = Math.round(a.fitNorm * 100);
  if (issues.length > 0) return { total: 0, perf: perfPct, value: 0, compat: 0, completeness: Math.round((filled / CATEGORY_ORDER.length) * 100), spend, over, overBy, issues, dead: true };
  // Engine composite: performance + cpu/gpu balance (value removed per design)
  const raw = (a.score / 1000) * 0.95 + (a.balance / 100) * 0.05;
  return { total: Math.round(clamp(raw, 0, 1) * 1000), perf: perfPct, value: a.ppScore, compat: 100, completeness: 100, spend, over, overBy, issues: [] };
}

// ---- AI opponent (elo-driven), v2 ----
// Instead of a single myopic perf-per-dollar greedy, the AI now GENERATES several
// diverse candidate builds and SCORES each with the real moggerScore(), then picks
// one by elo. This means:
//   - it optimizes the exact thing it's judged on (no proxy-objective mismatch),
//   - high elo reliably lands a near-optimal, full-budget build,
//   - low elo lands a deliberately weaker (but still coherent) build,
//   - difficulty scales smoothly instead of feeling random.
//
// mBuildCandidate builds ONE complete, compatible, budget-valid build given a spend
// cap and a strategy (metric = how upgrades are ranked, topK = how much randomness).
function mBuildCandidate(ucKey, budget, cap, metric, topK) {
  const W = USE_CASES[ucKey].alloc;
  const build = {};
  const order = [...CATEGORY_ORDER].sort((a, b) => (W[b] || 0) - (W[a] || 0));
  const up = (c, o) => ucPerf(c, o, ucKey);
  // Hard spend cap per category: no more than 2× the use-case budget band.
  // This prevents an AI from sinking 40% of a gaming budget into CPU at the
  // expense of GPU, and stops office builds from buying overkill CPUs.
  const catCap = {};
  for (const c of CATEGORY_ORDER) {
    catCap[c] = W[c] > 0 ? Math.round(budget * (W[c] / 100) * 2.0) : 0;
  }
  // Structural parts (mobo/cooler/psu/case) always get at least a $70 ceiling
  // even when their alloc weight is small, so they remain upgradeable.
  for (const c of ["mobo", "cooler", "psu", "case"]) { if (!catCap[c]) catCap[c] = 70; }
  const spent = () => CATEGORY_ORDER.reduce((s, c) => s + (build[c] ? build[c].price : 0), 0);
  const ok = (c, o) => {
    if (c === "mobo" && build.cpu && o.socket !== build.cpu.socket) return false;
    if (c === "cpu" && build.mobo && o.socket !== build.mobo.socket) return false;
    if (c === "cooler") { if (build.cpu && o.sockets && !o.sockets.includes(build.cpu.socket)) return false; if (build.cpu && o.tdpRating && o.tdpRating < build.cpu.tdp) return false; }
    if (c === "psu" && o.watt && o.watt < requiredWatts(build) * 1.35) return false;
    return true;
  };
  const cheapestMobo = (sock) => moggerOptions("mobo").filter((m) => m.socket === sock).sort((a, b) => a.price - b.price)[0];
  const cheapestCooler = (cpu) => moggerOptions("cooler").filter((cl) => (!cl.sockets || cl.sockets.includes(cpu.socket)) && (!cl.tdpRating || cl.tdpRating >= cpu.tdp)).sort((a, b) => a.price - b.price)[0];

  // 1) Valid, complete, cheap base.
  for (const c of order) {
    if (catCap[c] === 0) continue; // skip zero-alloc categories (e.g. gpu for office)
    const opts = [...moggerOptions(c)].sort((a, b) => a.price - b.price || up(c, b) - up(c, a));
    if (c === "cpu" && W.gpu === 0) {
      // GPU-less build: must use a CPU with integrated graphics
      const iOpts = opts.filter((o) => o.igpu);
      build[c] = (iOpts.find((o) => ok(c, o)) || iOpts[0]) || opts.find((o) => ok(c, o)) || opts[0];
    } else {
      build[c] = opts.find((o) => ok(c, o)) || opts[0];
    }
  }

  // upgrade ranking metric:
  //   "ratio" = weighted perf-per-extra-dollar (efficient, value-leaning)
  //   "abs"   = weighted absolute perf gain (commits to big high-impact parts like the GPU)
  const gainOf = (c, cur, o, delta) => {
    const w = W[c] || 0.02, dperf = up(c, o) - up(c, cur);
    return metric === "abs" ? dperf * w : (dperf * w) / delta;
  };

  // 2) Greedy upgrade pass. Collect every affordable improving move, rank them, and
  //    pick from the top-K (K=1 is deterministic/strongest; K>1 adds believable variety).
  let guard = 0, improved = true;
  while (improved && guard++ < 600) {
    improved = false;
    const moves = [];
    for (const c of order) {
      if (c === "psu") continue; // PSU is sized in fixValid — not a "perf" upgrade
      if (catCap[c] === 0) continue; // never upgrade zero-alloc categories (e.g. gpu for office)
      const cur = build[c]; if (!cur) continue;
      // Respect both the global VALUE_CEILING and the per-category use-case cap
      const vceil = Math.min(VALUE_CEILING[c] ?? Infinity, catCap[c] || Infinity);
      for (const o of moggerOptions(c)) {
        if (!ok(c, o) || up(c, o) <= up(c, cur)) continue;
        const delta = o.price - cur.price;
        if (delta < 0) continue; // cheaper AND better is never available by construction
        if (vceil !== Infinity && o.price > vceil) continue;
        if (spent() - cur.price + o.price > cap) continue;
        // delta === 0: free perf upgrade (same price, better part) — always take it
        moves.push({ kind: "one", c, part: o, gain: delta === 0 ? 1e9 : gainOf(c, cur, o, delta) });
      }
    }
    if (build.cpu) {
      for (const cpu of moggerOptions("cpu")) {
        if (up("cpu", cpu) <= up("cpu", build.cpu)) continue;
        if (catCap.cpu && cpu.price > catCap.cpu) continue; // don't over-invest in CPU
        if (W.gpu === 0 && !cpu.igpu) continue; // GPU-less builds must keep an iGPU CPU
        const mobo = cheapestMobo(cpu.socket), cooler = cheapestCooler(cpu);
        if (!mobo || !cooler) continue;
        const oldCost = build.cpu.price + (build.mobo ? build.mobo.price : 0) + (build.cooler ? build.cooler.price : 0);
        const newCost = cpu.price + mobo.price + cooler.price, delta = newCost - oldCost;
        if (delta <= 0) continue;
        if (spent() - oldCost + newCost > cap) continue;
        const w = W.cpu || 0.1, dperf = up("cpu", cpu) - up("cpu", build.cpu);
        moves.push({ kind: "platform", cpu, mobo, cooler, gain: metric === "abs" ? dperf * w : (dperf * w) / delta });
      }
    }
    if (!moves.length) break;
    moves.sort((a, b) => b.gain - a.gain);
    const k = Math.max(1, Math.min(topK || 1, moves.length));
    const pick = moves[k > 1 ? Math.floor(Math.random() * k) : 0];
    if (pick) {
      improved = true;
      if (pick.kind === "one") build[pick.c] = pick.part;
      else { build.cpu = pick.cpu; build.mobo = pick.mobo; build.cooler = pick.cooler; }
    }
  }

  // 3) Ensure cooler/PSU adequate, then trim under budget.
  const fixValid = () => {
    if (build.cpu) { const cl = cheapestCooler(build.cpu); if (cl && (!build.cooler || (build.cooler.tdpRating && build.cooler.tdpRating < build.cpu.tdp) || (build.cooler.sockets && !build.cooler.sockets.includes(build.cpu.socket)))) build.cooler = cl; }
    const d = requiredWatts(build) * 1.35; const dMax = d * 1.45;
    const psuPool = moggerOptions("psu").filter((p) => p.watt && p.watt >= d && p.watt <= dMax);
    const psu = (psuPool.length ? psuPool : moggerOptions("psu").filter((p) => p.watt && p.watt >= d)).sort((a, b) => a.price - b.price)[0];
    if (psu && (!build.psu || (build.psu.watt && build.psu.watt < d))) build.psu = psu;
  };
  fixValid();

  // 4b) Coerce RAM type + case fit so the build is never incompatible on those axes.
  const fixCompat = () => {
    // RAM must match the motherboard's type and capacity limit
    if (build.mobo) {
      const need = build.mobo.ramType, maxR = build.mobo.maxRam;
      const ramOk = (r) => (!need || !r.ramType || r.ramType === need) && (!maxR || !r.cap || r.cap <= maxR);
      if (!build.ram || !ramOk(build.ram)) {
        const cands = moggerOptions("ram").filter(ramOk).sort((a, b) => up("ram", b) - up("ram", a) || a.price - b.price);
        if (cands.length) { const within = cands.filter((r) => spent() - (build.ram ? build.ram.price : 0) + r.price <= budget); build.ram = within[0] || cands[cands.length - 1]; }
      }
    }
    // Case must fit the motherboard form, the GPU length, and the cooler height
    const caseFits = (cs) => (!build.mobo || !cs.forms || !build.mobo.form || cs.forms.includes(build.mobo.form))
      && (!build.gpu || !cs.maxGpu || !build.gpu.len || build.gpu.len <= cs.maxGpu)
      && (!build.cooler || !cs.maxCool || !build.cooler.height || build.cooler.height <= cs.maxCool);
    if (build.case && !caseFits(build.case)) {
      const cands = moggerOptions("case").filter(caseFits).sort((a, b) => a.price - b.price);
      if (cands.length) { const within = cands.filter((cs) => spent() - build.case.price + cs.price <= budget); build.case = within[0] || cands[0]; }
      else if (build.gpu) { // no case fits the GPU — take the roomiest case and shrink the GPU to fit
        const roomy = [...moggerOptions("case")].sort((a, b) => (b.maxGpu || 0) - (a.maxGpu || 0))[0];
        if (roomy) { build.case = roomy; const g = moggerOptions("gpu").filter((x) => !roomy.maxGpu || !x.len || x.len <= roomy.maxGpu).sort((a, b) => up("gpu", b) - up("gpu", a))[0]; if (g) build.gpu = g; }
      }
    }
  };
  fixCompat();

  // stricter check that also respects RAM/case fit — used once mobo/gpu/cooler are settled
  const fullOk = (c, o) => {
    if (!ok(c, o)) return false;
    if (c === "ram" && build.mobo) { if (build.mobo.ramType && o.ramType && o.ramType !== build.mobo.ramType) return false; if (build.mobo.maxRam && o.cap && o.cap > build.mobo.maxRam) return false; }
    if (c === "mobo") { if (build.ram && build.ram.ramType && o.ramType && o.ramType !== build.ram.ramType) return false; if (build.case && build.case.forms && o.form && !build.case.forms.includes(o.form)) return false; }
    if (c === "case") { if (build.mobo && build.mobo.form && o.forms && !o.forms.includes(build.mobo.form)) return false; if (build.gpu && build.gpu.len && o.maxGpu && build.gpu.len > o.maxGpu) return false; if (build.cooler && build.cooler.height && o.maxCool && build.cooler.height > o.maxCool) return false; }
    if (c === "gpu" && build.case && build.case.maxGpu && o.len && o.len > build.case.maxGpu) return false;
    if (c === "cooler" && build.case && build.case.maxCool && o.height && o.height > build.case.maxCool) return false;
    return true;
  };

  let tg = 0;
  while (spent() > budget && tg++ < 200) {
    let bestSwap = null;
    for (const c of order) {
      const cur = build[c]; if (!cur) continue;
      const cheaper = moggerOptions(c).filter((o) => fullOk(c, o) && o.price < cur.price).sort((a, b) => up(c, b) - up(c, a))[0];
      if (!cheaper) continue;
      const save = cur.price - cheaper.price; if (save <= 0) continue;
      const loss = (up(c, cur) - up(c, cheaper)) * (W[c] || 0.02) / save;
      if (!bestSwap || loss < bestSwap.loss) bestSwap = { c, part: cheaper, loss };
    }
    if (!bestSwap) break;
    build[bestSwap.c] = bestSwap.part;
  }

  return build;
}

// elo-driven AI. Higher elo => stronger, more consistent builds.
// Strategy: build a diverse POOL of candidates, score each on the real engine, then
// pick by elo — strong AI takes the best, weak AI reaches into the worse end.
function moggerAI(ucKey, budget, elo) {
  elo = (typeof elo === "number" && isFinite(elo)) ? clamp(elo, 0, 3000) : 600;
  const strength = elo / 3000; // 0..1

  // Very low elo only: a real chance of a genuinely broken (incompatible -> 0) build.
  const pIncompat = elo < 350 ? clamp(0.12 * (1 - elo / 350), 0, 0.12) : 0;
  if (Math.random() < pIncompat) {
    const W = USE_CASES[ucKey].alloc;
    const order = [...CATEGORY_ORDER].sort((a, b) => (W[b] || 0) - (W[a] || 0));
    const build = {};
    for (const c of order) { const opts = [...moggerOptions(c)].sort((a, b) => a.price - b.price); build[c] = opts[0]; }
    if (build.cpu) { const wrong = moggerOptions("mobo").find((m) => m.socket !== build.cpu.socket); if (wrong) build.mobo = wrong; }
    return build;
  }

  // Candidate pool — stronger AI explores more strategies and aims for fuller budget use.
  const N = 4 + Math.round(strength * 6); // 4 (weak) .. 10 (strong)
  const cands = [];
  for (let i = 0; i < N; i++) {
    const baseCap = clamp(0.80 + strength * 0.20, 0.80, 1.0); // weak ~80%, strong ~100% of budget
    const jitter = (Math.random() - 0.5) * 0.14;
    const cap = budget * clamp(baseCap + jitter, 0.5, 1.0);
    // mix the two upgrade strategies for genuine diversity in the pool
    const metric = (i % 3 === 0) ? "abs" : "ratio";
    // strong AI is near-deterministic (topK=1); weak AI is noisier and lands sloppier picks
    const topK = strength > 0.85 ? 1 : 1 + Math.round((1 - strength) * 3);
    cands.push(mBuildCandidate(ucKey, budget, cap, metric, topK));
  }

  // Score every candidate on the SAME engine the duel is judged by, best first.
  const scored = cands
    .map((b) => ({ b, s: moggerScore(b, ucKey, budget).total }))
    .sort((a, b) => b.s - a.s);

  // Pick by elo: elite -> the best build; weaker -> reach further down the (worse) pool.
  const span = scored.length - 1;
  let idx = 0;
  if (strength < 0.97 && span > 0) {
    const depth = (1 - strength) * span;          // how deep a weak AI can fall
    idx = Math.min(span, Math.round(depth * (0.55 + Math.random() * 0.5)));
  }
  let chosen = (scored[idx] || scored[0]).b;

  // Low/mid elo flavor: one compatible downgrade on a non-structural part (gpu/storage),
  // so weaker AIs visibly leave performance on the table without ever going incompatible.
  const pMistake = elo >= 2600 ? 0 : Math.max(0, 0.10 * Math.pow(1 - strength, 1.5));
  if (Math.random() < pMistake) {
    const safe = ["gpu", "storage"].filter((c) => chosen[c]);
    if (safe.length) {
      const c = safe[Math.floor(Math.random() * safe.length)];
      const cur = chosen[c];
      const cheaper = moggerOptions(c)
        .filter((o) => o.price < cur.price && ucPerf(c, o, ucKey) < ucPerf(c, cur, ucKey))
        .sort((a, b) => ucPerf(c, b, ucKey) - ucPerf(c, a, ucKey))[0];
      if (cheaper) chosen = { ...chosen, [c]: cheaper };
    }
  }

  return chosen;
}
// Custom rank can be plain text (legacy) or JSON {name,color,icon}.
function parseCrankOne(s) {
  const Q = String.fromCharCode(34);
  s = String(s).trim();
  for (let i = 0; i < 2; i++) {
    if (s.charCodeAt(0) === 123) {
      try {
        const o = JSON.parse(s);
        if (o && typeof o === 'object' && o.name) return { name: String(o.name), color: o.color || '#ff7ae0', icon: o.icon || '⭐' };
        if (typeof o === 'string') { s = o.trim(); continue; }
      } catch (e) {}
    }
    break;
  }
  if (s.indexOf(Q + 'name' + Q) >= 0) {
    const grab = (key) => { const t = s.indexOf(Q + key + Q); if (t < 0) return null; const colon = s.indexOf(':', t); if (colon < 0) return null; const q1 = s.indexOf(Q, colon + 1); if (q1 < 0) return null; const q2 = s.indexOf(Q, q1 + 1); if (q2 < 0) return null; return s.slice(q1 + 1, q2); };
    const nm = grab('name'); if (nm) return { name: nm, color: grab('color') || '#ff7ae0', icon: grab('icon') || '⭐' };
  }
  if (s.charCodeAt(0) === 123) return null;
  return { name: s, color: '#ff7ae0', icon: '⭐' };
}
function parseCrank(c) {
  if (!c) return [];
  let s = String(c).trim(); if (!s) return [];
  if (s.charCodeAt(0) === 91) {
    try { const arr = JSON.parse(s); if (Array.isArray(arr)) return arr.filter((o) => o && o.name).map((o) => ({ name: String(o.name), color: o.color || '#ff7ae0', icon: o.icon || '⭐' })); } catch (e) {}
  }
  const one = parseCrankOne(s);
  return one ? [one] : [];
}
function hexToRgba(hex, a) {
  let h = String(hex || "").replace("#", "");
  if (h.length === 3) h = h.split("").map((x) => x + x).join("");
  const n = parseInt(h, 16); if (isNaN(n) || h.length !== 6) return "rgba(255,122,224," + a + ")";
  return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
}
function eloRank(elo) {
  const e = typeof elo === "number" && isFinite(elo) ? elo : 0;
  if (e >= 2500) return { name: "God Tier", cls: "god", icon: "👑", color: "#ffc24b" };
  if (e >= 1500) return { name: "Elite Tier", cls: "elite", icon: "💎", color: "#7c5cff" };
  if (e >= 1300) return { name: "Slightly High Tier", cls: "shigh", icon: "🔷", color: "#5ec8ff" };
  if (e >= 950) return { name: "High Tier", cls: "high", icon: "⚡", color: "#19e8db" };
  if (e >= 650) return { name: "Mid Tier", cls: "mid", icon: "🔧", color: "#46e0a0" };
  return { name: "Low Tier", cls: "low", icon: "🔩", color: "#8aa0b4" };
}
// Returns array of ranks — custom badges if any, else [eloRank]
function moggerRanks(elo, custom) {
  const cr = parseCrank(custom);
  if (cr.length > 0) return cr.map((r) => ({ ...r, cls: "custom", custom: true }));
  return [eloRank(elo)];
}
// kept for backwards compat — returns first rank only
function moggerRank(elo, custom) { return moggerRanks(elo, custom)[0]; }
function RankBadge({ rank }) {
  if (!rank) return null;
  const style = rank.custom ? { color: "#fff", background: hexToRgba(rank.color, 0.2), borderColor: rank.color, boxShadow: "0 0 12px " + hexToRgba(rank.color, 0.45) } : undefined;
  return <span className={"pm-rank pm-rank-" + rank.cls} style={style}>{rank.icon} {rank.name}</span>;
}
function RankBadges({ elo, custom }) {
  return <>{moggerRanks(elo, custom).map((r, i) => <RankBadge key={i} rank={r} />)}</>;
}
// Searchable icon set (system emoji, rendered crisp/pixelated via CSS).
const MOGGER_EMOJI = [
  ["🖥️", "pc computer desktop monitor"], ["💻", "laptop computer"], ["🕹️", "joystick game arcade"], ["🎮", "controller gamepad game"], ["⌨️", "keyboard"], ["🖱️", "mouse"], ["💾", "save floppy disk"], ["💿", "disc cd"], ["🧠", "brain smart ai"], ["⚙️", "gear settings cog"], ["🔧", "wrench tool fix"], ["🔩", "bolt nut screw"], ["🔌", "plug power"], ["🔋", "battery power"], ["⚡", "bolt lightning power fast"], ["🛠️", "tools build"],
  ["👑", "crown king queen royal"], ["💎", "diamond gem rare"], ["🏆", "trophy win champion"], ["🥇", "gold medal first"], ["🥈", "silver medal second"], ["🥉", "bronze medal third"], ["🎖️", "medal honor"], ["🏅", "medal sports"], ["⭐", "star fav"], ["🌟", "star glowing"], ["✨", "sparkles shiny"], ["💫", "dizzy star"], ["🔥", "fire hot flame lit"], ["💥", "boom explosion"], ["☄️", "comet meteor"], ["🌈", "rainbow"],
  ["😀", "happy smile grin face"], ["😎", "cool sunglasses"], ["🤓", "nerd geek glasses"], ["🤖", "robot bot ai"], ["👽", "alien ufo"], ["👾", "alien monster game invader"], ["💀", "skull dead"], ["☠️", "skull crossbones pirate"], ["🤡", "clown"], ["👻", "ghost boo"], ["🎃", "pumpkin halloween"], ["😈", "devil evil"], ["🤠", "cowboy"], ["🥶", "cold freeze"], ["🤯", "mind blown"], ["😤", "angry steam"],
  ["🐉", "dragon mythical"], ["🦖", "dinosaur trex"], ["🦄", "unicorn"], ["🐺", "wolf"], ["🦁", "lion"], ["🐯", "tiger"], ["🐸", "frog"], ["🐢", "turtle slow"], ["🦈", "shark"], ["🐍", "snake"], ["🦅", "eagle bird"], ["🐝", "bee"], ["🦂", "scorpion"], ["🕷️", "spider"], ["🐙", "octopus"], ["🦀", "crab"],
  ["⚔️", "swords battle fight"], ["🛡️", "shield defense"], ["🏹", "bow arrow archer"], ["🗡️", "dagger sword"], ["🔫", "gun"], ["💣", "bomb"], ["🧨", "dynamite"], ["🎯", "target dart bullseye"], ["🚀", "rocket launch fast"], ["🛸", "ufo spaceship"], ["✈️", "plane"], ["🏎️", "race car fast"], ["🏍️", "motorcycle"], ["⛵", "boat sail"], ["🚂", "train"], ["🛹", "skateboard"],
  ["❤️", "heart love red"], ["🧡", "orange heart"], ["💛", "yellow heart"], ["💚", "green heart"], ["💙", "blue heart"], ["💜", "purple heart"], ["🖤", "black heart"], ["🤍", "white heart"], ["💯", "hundred perfect score"], ["✅", "check done ok"], ["❌", "x cross no"], ["⛔", "no stop forbidden"], ["⚠️", "warning caution"], ["🚩", "flag red"], ["🏁", "checkered flag finish race"], ["🎌", "flags"],
  ["🎵", "music note"], ["🎧", "headphones audio"], ["🎸", "guitar rock"], ["🥁", "drums"], ["🎹", "piano keys"], ["🎤", "mic sing"], ["📷", "camera photo"], ["🎬", "movie film clapper"], ["📺", "tv"], ["💡", "idea light bulb"], ["🔦", "flashlight"], ["🕯️", "candle"], ["🪙", "coin money"], ["💰", "money bag rich"], ["💵", "cash dollar"], ["💳", "card"],
  ["🌌", "galaxy space stars milky way"], ["🌙", "moon crescent night"], ["☀️", "sun"], ["⛈️", "storm thunder"], ["❄️", "snow ice cold"], ["🌊", "wave water ocean"], ["🍀", "clover luck"], ["🌹", "rose flower"], ["🌵", "cactus"], ["🍕", "pizza food"], ["🍔", "burger food"], ["🍩", "donut"], ["🍺", "beer"], ["☕", "coffee"], ["🧊", "ice cube cold"], ["🧃", "juice"],
  ["👊", "fist punch"], ["✊", "fist raised"], ["🤛", "fist bump"], ["👍", "thumbs up like"], ["👎", "thumbs down"], ["🙌", "raise hands celebrate"], ["👀", "eyes look"], ["🫡", "salute"], ["🤙", "call shaka"], ["✌️", "peace victory"], ["🤘", "rock horns metal"], ["🫶", "heart hands"], ["💪", "muscle strong flex"], ["🦾", "robot arm cyborg"], ["🧿", "evil eye"], ["♾️", "infinity forever"],
];
function MoggerEmojiPicker({ onPick }) {
  const [q, setQ] = useState("");
  const list = useMemo(() => { const t = q.trim().toLowerCase(); return t ? MOGGER_EMOJI.filter(([e, k]) => k.includes(t)) : MOGGER_EMOJI; }, [q]);
  return (
    <div className="pm-emoji-pick">
      <div className="pm-emoji-search"><Search size={13} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search icons…" autoFocus /></div>
      <div className="pm-emoji-grid">
        {list.map(([e], i) => <button key={i} className="pm-emoji-btn" title={e} onClick={() => onPick(e)}>{e}</button>)}
        {list.length === 0 && <span className="pm-emoji-none">No icons match</span>}
      </div>
    </div>
  );
}
function moggerRollTier() { const r = Math.random(); return r < 0.62 ? "elite" : r < 0.93 ? "normal" : "fail"; }
// AI difficulty by elo: higher elo -> stronger, more consistent builds.
function moggerTierFromElo(elo) {
  const pFail = clamp(0.6 - elo / 2000, 0.02, 0.7);
  const pElite = clamp(elo / 2500, 0.05, 0.95);
  const r = Math.random();
  if (r < pElite) return "elite";
  if (r < pElite + pFail) return "fail";
  return "normal";
}

function moggerSpecs(p, cat) {
  const s = [];
  if (cat === "cpu") { if (p.socket) s.push(["Socket", p.socket]); if (p.cores) s.push(["Cores", p.cores]); if (p.tdp) s.push(["TDP", p.tdp + "W"]); if (p.igpu) s.push(["iGPU", "Yes"]); }
  else if (cat === "gpu") { if (p.vram) s.push(["VRAM", p.vram + "GB"]); if (p.tdp) s.push(["TDP", p.tdp + "W"]); if (p.len) s.push(["Length", p.len + "mm"]); }
  else if (cat === "ram") { if (p.cap) s.push(["Capacity", p.cap + "GB"]); if (p.ramType) s.push(["Type", p.ramType]); if (p.speed) s.push(["Speed", p.speed + " MT/s"]); }
  else if (cat === "storage") { if (p.cap) s.push(["Capacity", p.cap >= 1000 ? (p.cap / 1000) + "TB" : p.cap + "GB"]); if (p.iface || p.kind) s.push(["Interface", p.iface || p.kind]); }
  else if (cat === "mobo") { if (p.socket) s.push(["Socket", p.socket]); if (p.ramType) s.push(["RAM", p.ramType]); if (p.form) s.push(["Form", p.form]); if (p.m2 != null) s.push(["M.2 slots", p.m2]); }
  else if (cat === "psu") { if (p.watt) s.push(["Wattage", p.watt + "W"]); if (p.eff) s.push(["Rating", "80+ " + p.eff]); }
  else if (cat === "cooler") { if (p.sockets) s.push(["Sockets", p.sockets.join("/")]); if (p.tdpRating) s.push(["Cools", "up to " + p.tdpRating + "W"]); if (p.type) s.push(["Type", p.type]); if (p.height) s.push(["Height", p.height + "mm"]); }
  return s;
}

const MOGGER_FILTERS = {
  cpu: [{ k: "socket", label: "Socket" }],
  gpu: [{ k: "vram", label: "VRAM", fmt: (v) => v + "GB" }],
  mobo: [{ k: "socket", label: "Socket" }, { k: "ramType", label: "RAM" }, { k: "form", label: "Form" }],
  ram: [{ k: "ramType", label: "Type" }, { k: "cap", label: "Size", fmt: (v) => v + "GB" }],
  storage: [{ k: "kind", label: "Type" }, { k: "cap", label: "Size", fmt: (v) => (v >= 1000 ? v / 1000 + "TB" : v + "GB") }],
  psu: [{ k: "watt", label: "Watts", fmt: (v) => v + "W" }, { k: "eff", label: "Rating" }],
  case: [{ k: "forms", label: "Fits", arr: true }],
  cooler: [{ k: "sockets", label: "Socket", arr: true }, { k: "type", label: "Type", fmt: (v) => (v === "aio" ? "AIO liquid" : "Air") }],
};
const MOGGER_SORTS = [
  { k: "price-asc", label: "Price ↑" },
  { k: "price-desc", label: "Price ↓" },
  { k: "perf-desc", label: "Performance" },
  { k: "name-asc", label: "Name A–Z" },
];

const AI_TAUNTS = [
  "Already found the perfect combo for this budget.",
  "You're still reading this? I'm halfway done.",
  "Processing optimal build… done.",
  "My cooler choice alone will decide this.",
  "Budget efficiency: maximized.",
  "Interesting GPU selection you're eyeing there.",
  "I see your strategy. Countering it now.",
  "Thinking… or panicking?",
  "I don't make mistakes. Only optimal decisions.",
  "Locked in. Waiting for you to catch up.",
];

// Human-feeling opponent personas keyed by elo tier.
// Each has a name, a tagline shown on the result screen, and win/loss quips.
const AI_PERSONAS = [
  { minElo: 0,    name: "Budget Barry",  tag: "First PC build™",       taunts: ["wait what's a mobo", "lol whatever was cheapest"], wins: ["accidentally won i think??", "beginner's luck fr"], losses: ["yeah that tracks", "okay okay you got me"] },
  { minElo: 450,  name: "Dave",          tag: "Learning the ropes",     taunts: ["I think this looks good?", "decent build tbh"], wins: ["not bad for a noob", "catching on quick"], losses: ["okay you know your stuff", "next time tho"] },
  { minElo: 900,  name: "TechMike",      tag: "5 years on r/buildapc",  taunts: ["I read the reviews", "picked this for the value"], wins: ["that's what I said on reddit", "efficiency > flash"], losses: ["weird, the benchmarks said otherwise", "respectable"] },
  { minElo: 1400, name: "CraftedRigs",   tag: "Builds PCs for friends", taunts: ["I've built 20 of these", "locked in under a minute"], wins: ["experience shows", "clean build wins clean"], losses: ["okay that use-case tripped me", "solid play"] },
  { minElo: 1900, name: "BenchWarrior",  tag: "OC'ing since 2015",      taunts: ["Optimized every slot", "I don't leave budget on the table"], wins: ["margin of excellence", "the numbers don't lie"], losses: ["one category off — I'll remember that", "rare L"] },
  { minElo: 2400, name: "Apex",          tag: "Pro system integrator",  taunts: ["Read the spec sheet", "I know where your budget leaks"], wins: ["efficient. balanced. dominant.", "as expected"], losses: ["exceptional build. noted.", "you forced a better outcome"] },
  { minElo: 2800, name: "GOD_MODE",      tag: "~3% win chance — but legends have done it", taunts: ["MAXIMUM PERFORMANCE INCOMING", "every dollar is accounted for"], wins: ["PERFECTION ACHIEVED", "resistance is futile"], losses: ["...that's a first", "consider yourself elite"] },
];

function aiPersona(elo) {
  return [...AI_PERSONAS].reverse().find((p) => elo >= p.minElo) || AI_PERSONAS[0];
}

// Random pick from an array — no side effects, safe to call anywhere
function pickRand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function duelMVP(build, useCase, budget) {
  const base = moggerScore(build, useCase, budget).total;
  let bestCat = null, bestDrop = -1;
  for (const c of CATEGORY_ORDER) {
    if (!build[c]) continue;
    const without = { ...build };
    delete without[c];
    const drop = base - moggerScore(without, useCase, budget).total;
    if (drop > bestDrop) { bestDrop = drop; bestCat = c; }
  }
  return bestCat;
}

function MoggerHistory({ onBack }) {
  const hist = useMemo(() => { try { return JSON.parse(localStorage.getItem("mogger_history") || "[]"); } catch(e) { return []; } }, []);
  const [viewEntry, setViewEntry] = useState(null);
  const clear = () => { try { localStorage.removeItem("mogger_history"); } catch(e) {} window.location.reload(); };
  if (viewEntry) {
    const ucLabel = (USE_CASES[viewEntry.useCase] || {}).label || viewEntry.useCase;
    return (
      <div className="pm-card rf-fade">
        <h2 className="pm-h2">📼 Match Replay — {viewEntry.date}</h2>
        <p className="pm-p pm-dim">{ucLabel} · {fmt(viewEntry.budget)}</p>
        <p className="pm-p">{viewEntry.won ? "🏆 WIN" : "💀 LOSS"} — You {viewEntry.myScore} vs {viewEntry.oppName} {viewEntry.oppScore}</p>
        {viewEntry.you && viewEntry.opp && (
          <table className="pm-replay-table">
            <tbody>
              {CATEGORY_ORDER.map(c => (
                <tr key={c}>
                  <td className="right">{viewEntry.you[c] ? (viewEntry.you[c].model || viewEntry.you[c].name) : "—"}</td>
                  <td className="cat">{CAT_META[c].label}</td>
                  <td>{viewEntry.opp[c] ? (viewEntry.opp[c].model || viewEntry.opp[c].name) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button className="rf-btn rf-ghost-btn" onClick={() => setViewEntry(null)}><ChevronLeft size={16} /> Back</button>
      </div>
    );
  }
  return (
    <div className="pm-card rf-fade">
      <h2 className="pm-h2">📜 Duel History</h2>
      {hist.length === 0 ? (
        <div className="pm-hist-empty">
          <svg className="pm-hist-empty-svg" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="10" y="12" width="100" height="66" rx="6" stroke="currentColor" strokeWidth="3" opacity="0.4"/>
            <rect x="20" y="22" width="80" height="46" rx="3" fill="currentColor" opacity="0.08"/>
            <rect x="45" y="78" width="30" height="6" rx="2" fill="currentColor" opacity="0.3"/>
            <rect x="35" y="84" width="50" height="4" rx="2" fill="currentColor" opacity="0.2"/>
            <circle cx="60" cy="45" r="12" stroke="currentColor" strokeWidth="2.5" opacity="0.35"/>
            <path d="M54 45l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
          </svg>
          <p className="pm-hist-empty-msg">No matches yet</p>
          <p className="pm-p pm-dim" style={{marginBottom:"16px"}}>Build your first PC and duel an AI opponent.</p>
          <button className="rf-btn rf-cta-btn" onClick={onBack}>Play your first match</button>
        </div>
      ) : (
        <div className="pm-hist-list">
          {[...hist].reverse().map((h, i) => (
            <div key={i} className={"pm-hist-row " + (h.won ? "win" : "lose")}>
              <span className="pm-hist-result">{h.won ? "🏆 WIN" : "💀 LOSS"}</span>
              <span className="pm-hist-info">{(USE_CASES[h.useCase] || {}).label || h.useCase} · {fmt(h.budget)}</span>
              <span className="pm-hist-score">{h.myScore} vs {h.oppScore}</span>
              <span className="pm-hist-opp">vs {h.oppName}{h.you && <ArchetypeBadge build={h.you} useCase={h.useCase} budget={h.budget} />}</span>
              <span className="pm-hist-date">{h.date}</span>
              <button className="rf-btn rf-ghost-btn" style={{fontSize:"0.75rem",padding:"2px 8px"}} onClick={() => setViewEntry(h)}>▶ View</button>
            </div>
          ))}
        </div>
      )}
      <div className="pm-row"><button className="rf-btn rf-ghost-btn" onClick={onBack}><ChevronLeft size={16} /> Back</button>{hist.length > 0 && <button className="rf-btn rf-ghost-btn" style={{color:"var(--c-bad)"}} onClick={clear}>Clear history</button>}</div>
    </div>
  );
}

// Ghost Duel Replay — challenge any past build (yours or an AI opponent's you've faced),
// the AI side replays its real recorded parts move-by-move instead of generating a fresh build.
function MoggerGhosts({ onBack, onChallenge }) {
  const [ghosts, setGhosts] = useState(() => {
    try { return [...JSON.parse(localStorage.getItem("mogger_ghosts") || "[]")].reverse(); } catch (e) { return []; }
  });
  const removeGhost = (id) => {
    try {
      const all = JSON.parse(localStorage.getItem("mogger_ghosts") || "[]").filter((g) => g.id !== id);
      localStorage.setItem("mogger_ghosts", JSON.stringify(all));
    } catch (e) {}
    setGhosts((g) => g.filter((x) => x.id !== id));
  };
  return (
    <div className="pm-card rf-fade">
      <h2 className="pm-h2">👻 Ghost Duels</h2>
      <p className="pm-p pm-dim">Challenge a recorded build from a past duel — the AI side replays its real parts, move by move.</p>
      {ghosts.length === 0 ? <p className="pm-p pm-dim">No ghosts yet — finish a duel to bank one.</p> : (
        <div className="pm-ghost-list">
          {ghosts.map((g) => (
            <div key={g.id} className="pm-ghost-row">
              <div className="pm-ghost-info">
                <span className="pm-ghost-label">{g.label}</span>
                <span className="pm-ghost-meta">{(USE_CASES[g.useCase] || {}).label || g.useCase} · {fmt(g.budget)} · Score {g.score}</span>
                {g.build && <ArchetypeBadge build={g.build} useCase={g.useCase} budget={g.budget} />}
              </div>
              <div className="pm-ghost-actions">
                <button className="rf-btn pm-ghost-challenge" onClick={() => onChallenge(g)}>⚔️ Challenge</button>
                <button className="rf-icon-btn" onClick={() => removeGhost(g.id)} title="Remove ghost"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="rf-btn rf-ghost-btn" onClick={onBack}><ChevronLeft size={16} /> Back</button>
    </div>
  );
}

// Faction Wars — monthly event, pick a side, ranked wins earn it points, dominance bar
// shows the live split, and last month's winner gets a cosmetic trophy badge.
function FactionDominanceBar({ totals }) {
  const total = Math.max(1, (totals.a || 0) + (totals.b || 0));
  const aPct = Math.round((totals.a || 0) / total * 100);
  return (
    <div className="pm-faction-bar">
      <div className="pm-faction-bar-fill a" style={{ width: aPct + "%" }} />
      <div className="pm-faction-bar-fill b" style={{ width: (100 - aPct) + "%" }} />
    </div>
  );
}
function MoggerFactions({ onBack, user, onUserUpdate }) {
  const { war, weekKey } = useMemo(() => currentFactionWar(), []);
  const localKey = "mogger_faction_local_" + weekKey + "_" + war.id;
  const [pick, setPick] = useState(() => {
    try { const p = JSON.parse(localStorage.getItem("mogger_faction_pick") || "null"); return (p && p.weekKey === weekKey && p.warId === war.id) ? p.faction : null; } catch (e) { return null; }
  });
  const [totals, setTotals] = useState(() => {
    try { return JSON.parse(localStorage.getItem(localKey) || '{"a":0,"b":0}'); } catch (e) { return { a: 0, b: 0 }; }
  });
  const [remote, setRemote] = useState(false);
  const [trophy, setTrophy] = useState(null);
  const [rewardMsg, setRewardMsg] = useState(null);
  useEffect(() => {
    netFactionTotals(weekKey, war.id).then((r) => { if (r) { setTotals(r); setRemote(true); } });
    const { war: pw, weekKey: pwk } = previousFactionWar();
    netFactionTotals(pwk, pw.id).then((r) => {
      const t = r || (() => { try { return JSON.parse(localStorage.getItem("mogger_faction_local_" + pwk + "_" + pw.id) || "null"); } catch (e) { return null; } })();
      if (t && (t.a > 0 || t.b > 0)) setTrophy({ war: pw, weekKey: pwk, winner: t.a >= t.b ? "a" : "b" });
    });
    // Opportunistically settle last week's reward — any client visiting this screen can
    // trigger it, the DB function itself guards against double-paying. No cron needed.
    netApplyFactionWeekReward(pwk).then((res) => {
      if (!res || !res.winner || !user) return;
      netFetchUser(user.id).then((srv) => {
        if (srv && srv.elo !== user.elo) { onUserUpdate({ id: srv.id, name: srv.name, elo: srv.elo, crank: srv.crank || null }); setRewardMsg("🏆 Last week's Faction War paid out — your elo just updated!"); }
      });
    });
  }, [weekKey, war.id]);
  const choose = (faction) => {
    setPick(faction);
    try { localStorage.setItem("mogger_faction_pick", JSON.stringify({ weekKey, warId: war.id, faction })); } catch (e) {}
    if (user) netSetFactionPick(user.id, weekKey, war.id, faction);
  };
  const sideCard = (side, key) => (
    <button key={key} className={"pm-faction-card" + (pick === key ? " on" : "")} onClick={() => choose(key)}>
      <span className="pm-faction-emoji">{side.emoji}</span>
      <span className="pm-faction-name">{side.label}</span>
      <span className="pm-faction-pts">{totals[key] || 0} pts</span>
      {pick === key && <span className="pm-faction-joined">✓ Your faction</span>}
    </button>
  );
  return (
    <div className="pm-card rf-fade">
      <h2 className="pm-h2">⚔️ {war.label}</h2>
      <p className="pm-p pm-dim">This week's faction event — pick a side. Every ranked win earns your faction points (+bonus if your build's hardware matches). When the week ends, each winning member's ELO bonus equals their personal contribution % (capped at 5% × contributors/10).{!remote && " Showing this device's local tally until the next sync."}</p>
      {rewardMsg && <div className="pm-faction-trophy" style={{ borderColor: "var(--c-good)", color: "var(--c-good)" }}>{rewardMsg}</div>}
      <div className="pm-faction-grid">
        {sideCard(war.a, "a")}
        {sideCard(war.b, "b")}
      </div>
      <FactionDominanceBar totals={totals} />
      {!user && <p className="pm-seg-note">Log in and play ranked duels — winning faction members earn an ELO bonus proportional to their personal contribution at week's end.</p>}
      {trophy && (
        <div className="pm-faction-trophy">
          🏆 Last week's {trophy.war.label} went to <b>{trophy.winner === "a" ? trophy.war.a.label : trophy.war.b.label}</b> — members earned ELO bonuses based on their contribution
        </div>
      )}
      <button className="rf-btn rf-ghost-btn" onClick={onBack}><ChevronLeft size={16} /> Back</button>
    </div>
  );
}

// Constraint Gauntlet result — solo score-attack, personal best, and a local/global leaderboard.
function MoggerGauntletResult({ round, build, user, onMenu, onPlayAgain }) {
  const s = useMemo(() => gauntletScore(build, round.useCase, round.budget, round.constraint), [build, round]);
  const violated = s.issues.length > 0;
  const [best, setBest] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const [rows, setRows] = useState([]);
  const savedRef = useRef(false);
  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    try {
      const prevBest = +(localStorage.getItem("mogger_gauntlet_best") || "0");
      setBest(Math.max(prevBest, s.total));
      if (s.total > prevBest) { localStorage.setItem("mogger_gauntlet_best", String(s.total)); setIsNewBest(true); }
      const all = JSON.parse(localStorage.getItem("mogger_gauntlet_scores") || "[]");
      all.push({ user_name: user ? user.name : "You", day_key: round.dayKey, constraint_id: round.constraint.id, use_case: round.useCase, budget: round.budget, score: s.total });
      if (all.length > 100) all.splice(0, all.length - 100);
      localStorage.setItem("mogger_gauntlet_scores", JSON.stringify(all));
      const today = all.filter((r) => r.day_key === round.dayKey).sort((a, b) => b.score - a.score).slice(0, 10);
      setRows(today);
    } catch (e) {}
    netRecordGauntletScore(user ? user.id : null, user ? user.name : "Anonymous", round.dayKey, round.constraint.id, round.useCase, round.budget, s.total);
    netGauntletLeaderboard(round.dayKey, 10).then((r) => { if (r && r.length) setRows(r); });
  }, []);
  return (
    <div className="pm-result pm-gauntlet-result rf-fade">
      <h2 className="pm-h2">🎯 Constraint Gauntlet</h2>
      <p className="pm-p pm-dim">{round.constraint.label} · {USE_CASES[round.useCase].label} · {fmt(round.budget)}</p>
      <div className={"pm-gauntlet-score" + (violated ? " pm-gauntlet-violated" : "")}>{s.total}<small style={{ fontSize: "1rem" }}>/1000</small></div>
      {violated ? <p className="pm-p" style={{ color: "var(--c-bad)" }}>{s.issues.join(" · ")}</p> : <ArchetypeBadge build={build} useCase={round.useCase} budget={round.budget} />}
      <div className="pm-gauntlet-best">{isNewBest ? "🏆 New personal best!" : <>Personal best: <b>{best}</b></>}</div>
      {rows.length > 0 && (
        <div className="pm-gauntlet-lb">
          {rows.slice(0, 10).map((r, i) => (
            <div key={i} className="pm-gauntlet-lb-row">
              <span className="pm-gauntlet-lb-rank">#{i + 1}</span>
              <span>{r.user_name || "You"} — {(GAUNTLET_CONSTRAINTS.find((c) => c.id === r.constraint_id) || {}).label || ""}</span>
              <span className="pm-gauntlet-lb-score">{r.score}</span>
            </div>
          ))}
        </div>
      )}
      <div className="pm-row pm-center-row">
        <button className="rf-btn rf-ghost-btn" onClick={onMenu}>Menu</button>
        <button className="rf-btn" onClick={onPlayAgain}><Repeat2 size={16} /> Retry today's gauntlet</button>
      </div>
    </div>
  );
}

// C11: Sale badge helpers (deterministic hash based on id/name+date)
function isOnSale(part) {
  if (!part) return false;
  const str = (part.id || part.name || "") + new Date().toDateString();
  let h = 0; for (let i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) >>> 0; }
  return h % 7 === 0; // ~1/7 parts on sale each day
}
function saleAmt(part) {
  if (!part) return 0;
  const str = (part.id || part.name || "") + new Date().toDateString();
  let h = 0; for (let i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) >>> 0; }
  return 5 + (h % 4) * 5; // 5%, 10%, 15%, or 20%
}

function MoggerPicker({ cat, current, budget, spent, onPick, onClose, useCase, bannedParts = null }) {
  const all = useMemo(() => moggerOptionsAll(cat), [cat]);
  const bestValueId = useMemo(() => {
    let best = null, bestRatio = -1;
    for (const o of all) {
      if (!o.price || o.price <= 0) continue;
      const ratio = ucPerf(cat, o, useCase || "gaming") / o.price;
      if (ratio > bestRatio) { bestRatio = ratio; best = o.id; }
    }
    return best;
  }, [all, cat, useCase]);
  const [q, setQ] = useState("");
  const [info, setInfo] = useState(null);
  const [sort, setSort] = useState("price-asc");
  const [flt, setFlt] = useState({});
  const filters = MOGGER_FILTERS[cat] || [];
  const filterVals = useMemo(() => {
    const out = {};
    for (const f of filters) {
      const set = new Set();
      for (const o of all) { const v = o[f.k]; if (v == null) continue; if (f.arr) { for (const x of v) set.add(x); } else set.add(v); }
      out[f.k] = [...set].sort((a, b) => (typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b))));
    }
    return out;
  }, [all, cat]);
  const opts = useMemo(() => {
    const t = q.trim().toLowerCase();
    let list = !t ? all : all.filter((o) => ((o.model || "") + " " + (o.name || "") + " " + (o.brand || "")).toLowerCase().includes(t));
    if (bannedParts && bannedParts.length > 0) {
      const bannedKeys = new Set(bannedParts.map(b => b.cat+":"+b.name));
      list = list.filter(o => !bannedKeys.has(cat+":"+o.name));
    }
    for (const f of filters) {
      const sel = flt[f.k];
      if (sel == null || sel === "") continue;
      list = list.filter((o) => { const v = o[f.k]; if (v == null) return false; return f.arr ? v.map(String).includes(sel) : String(v) === sel; });
    }
    const arr = [...list];
    if (sort === "price-asc") arr.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") arr.sort((a, b) => b.price - a.price);
    else if (sort === "perf-desc") arr.sort((a, b) => (b.perf || 0) - (a.perf || 0));
    else if (sort === "name-asc") arr.sort((a, b) => (a.model || a.name || "").localeCompare(b.model || b.name || ""));
    return arr;
  }, [all, q, sort, flt, cat]);
  const cap = budget + 50; // hard limit: cannot go more than $50 over budget
  const Icon = CAT_META[cat].Icon;
  return (
    <div className="pm-drawer-wrap" onClick={onClose}>
      <div className="pm-drawer rf-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="pm-drawer-head"><span>Choose {CAT_META[cat].label}</span><button className="pm-x" onClick={onClose}><X size={18} /></button></div>
        <div className="pm-search"><Search size={15} /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={"Search " + CAT_META[cat].label.toLowerCase() + "…"} />{q && <button className="pm-search-x" onClick={() => setQ("")}><X size={13} /></button>}</div>
        <div className="pm-filters">
          <select className="pm-fsel" value={sort} onChange={(e) => setSort(e.target.value)}>{MOGGER_SORTS.map((s) => <option key={s.k} value={s.k}>{s.label}</option>)}</select>
          {filters.map((f) => (
            <select key={f.k} className={"pm-fsel" + (flt[f.k] ? " on" : "")} value={flt[f.k] || ""} onChange={(e) => setFlt((p) => ({ ...p, [f.k]: e.target.value }))}>
              <option value="">{f.label}: all</option>
              {(filterVals[f.k] || []).map((v) => <option key={String(v)} value={String(v)}>{f.fmt ? f.fmt(v) : String(v)}</option>)}
            </select>
          ))}
          {(Object.values(flt).some(Boolean)) && <button className="pm-fclear" onClick={() => setFlt({})}>Clear</button>}
        </div>
        <div className="pm-opts">
          {opts.map((o) => {
            const sel = current && current.id === o.id;
            const oos = !!o._oos;
            const wouldBe = spent - (current ? current.price : 0) + o.price;
            const blocked = (oos || wouldBe > cap) && !sel;
            const showSpecs = info === o.id;
            const specs = showSpecs ? moggerSpecs(o, cat) : null;
            return (
              <div key={o.id} className="pm-optwrap">
                <div className={"pm-opt" + (sel ? " sel" : "") + (blocked ? " blocked" : "") + (oos ? " oos" : "")}>
                  <button className="pm-opt-pick" disabled={blocked} onClick={() => { if (!blocked) onPick(o); }}>
                    <span className="pm-opt-img">{o.img ? <img src={o.img} alt="" loading="lazy" /> : <Icon size={18} />}</span>
                    <span className="pm-opt-main"><span className="pm-opt-name">{o.model || o.name}{isOnSale(o) && <span className="rf-sale-badge">{saleAmt(o)}% OFF</span>}{o.id === bestValueId && <span className="rf-best-val">★ Best Value</span>}</span><span className="pm-opt-brand">{o.brand}</span></span>
                    <span className="pm-opt-right">{oos ? <span className="pm-opt-oos">Out of stock</span> : <><span className="pm-opt-price">{o.price === 0 ? "Free" : fmt(o.price)}</span>{blocked ? <span className="pm-opt-block">over limit</span> : <span className={"pm-opt-bar" + (wouldBe > budget ? " over" : "")}><i style={{ width: clamp(o.perf, 4, 100) + "%" }} /></span>}</>}</span>
                  </button>
                  <button className="pm-opt-info" onClick={() => setInfo(showSpecs ? null : o.id)}>{showSpecs ? "Hide" : "Specs"}</button>
                </div>
                {showSpecs && <div className="pm-specs">{specs.length ? specs.map(([k, v], i) => <span key={i}><i>{k}</i>{v}</span>) : <span className="pm-specs-none">No specs listed</span>}</div>}
              </div>
            );
          })}
          {opts.length === 0 && <div className="pm-empty">No matches</div>}
        </div>
      </div>
    </div>
  );
}

const DUEL_TIPS = [
  "Prioritise your biggest alloc category first",
  "For gaming, GPU is king — spend ~34% there",
  "RAM speed past DDR5-6000 scores lower, not higher",
  "An incompatible build scores 0 — always check compat",
  "Budget adherence matters — try to use 90%+ of your budget",
  "For office builds, you don't need a discrete GPU",
  "Balance CPU and GPU — a huge GPU with a weak CPU gets penalised",
  "For AI/ML, GPU VRAM matters more than clock speed",
];

function MoggerBuild({ round, player, oppLabel, oppBuild, oppLocked, oppIsAI, ghostMode, liveOpp, oppLiveScore, oppLiveDone, onMyScore, myElo, oppElo, onDone, solo, constraint, bannedParts = null }) {
  const oppFinal = useMemo(() => (oppBuild ? moggerScore(oppBuild, round.useCase, round.budget).total : null), []);
  const [build, setBuild] = useState({});
  const [open, setOpen] = useState(null);
  const [left, setLeft] = useState(round.secs);
  const [oppShown, setOppShown] = useState(oppFinal == null ? null : (oppLocked ? oppFinal : 0));
  const [oppDone, setOppDone] = useState(!!oppLocked);
  const ref = useRef(build); ref.current = build;
  const [taunt, setTaunt] = useState("");
  const [tipIdx, setTipIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTipIdx((i) => (i + 1) % DUEL_TIPS.length), 8000);
    return () => clearInterval(iv);
  }, []);
  useEffect(() => {
    if (!oppIsAI) return;
    const cycle = () => setTaunt(AI_TAUNTS[Math.floor(Math.random() * AI_TAUNTS.length)]);
    cycle();
    const iv = setInterval(cycle, 4500);
    return () => clearInterval(iv);
  }, [oppIsAI]);
  useEffect(() => {
    const t = setInterval(() => setLeft((l) => { if (l <= 1) { clearInterval(t); onDone(ref.current); return 0; } return l - 1; }), 1000);
    return () => clearInterval(t);
  }, []);
  const hasOpp = oppIsAI || !!oppBuild || !!liveOpp;
  const mkDecoy = () => { const d = {}; for (const c of CATEGORY_ORDER) { const o = moggerOptions(c); d[c] = o[Math.floor(Math.random() * o.length)]; } return d; };
  const [decoy, setDecoy] = useState(mkDecoy);
  const swapOneDecoy = () => setDecoy((prev) => { const c = CATEGORY_ORDER[Math.floor(Math.random() * CATEGORY_ORDER.length)]; const o = moggerOptions(c); return { ...prev, [c]: o[Math.floor(Math.random() * o.length)] }; });
  // my live score (broadcast to opponent online); shown as "?" locally
  const myScore = useMemo(() => moggerScore(build, round.useCase, round.budget).total, [build]);
  useEffect(() => { if (onMyScore) onMyScore(myScore); }, [myScore]);
  // live online opponent: flicker one part each time their score updates
  useEffect(() => { if (liveOpp) swapOneDecoy(); }, [oppLiveScore]);
  // AI opponent: score fluctuates upward (chunky +50-120, occasional -50-120), then locks in.
  // Each score tick swaps exactly ONE part in its (blurred) build — not all at once.
  useEffect(() => {
    if (oppFinal == null || oppLocked || ghostMode) return;
    const lockAt = round.secs * (0.55 + Math.random() * 0.3); // seconds elapsed when AI locks
    const ceiling = Math.max(0, oppFinal); // climb toward the AI's real score (0 if its build is incompatible)
    const t0 = Date.now();
    let cur = 0;
    let iv;
    const step = () => {
      const elapsed = (Date.now() - t0) / 1000;
      if (elapsed >= lockAt) { setOppShown(oppFinal); setOppDone(true); return; }
      const roll = Math.random();
      let d;
      if (roll < 0.18) d = -(50 + Math.random() * 70);
      else if (roll < 0.30) d = (120 + Math.random() * 80);
      else d = (50 + Math.random() * 70);
      cur = Math.max(0, Math.min(ceiling, cur + d));
      setOppShown(Math.round(cur));
      swapOneDecoy(); // one part changes, in sync with the score
      iv = setTimeout(step, 1700 + Math.random() * 1100);
    };
    iv = setTimeout(step, 900);
    return () => clearTimeout(iv);
  }, []);
  // Ghost Duel Replay: instead of random decoys, reveal the ghost's REAL parts one
  // category at a time (in build order) so it genuinely replays move-by-move.
  useEffect(() => {
    if (!ghostMode || !oppBuild || oppFinal == null || oppLocked) return;
    const lockAt = round.secs * (0.55 + Math.random() * 0.3);
    const cats = CATEGORY_ORDER.filter((c) => oppBuild[c]);
    const stepMs = cats.length ? Math.max(400, (lockAt * 1000) / cats.length) : 1000;
    let revealed = 0;
    let iv;
    const step = () => {
      revealed++;
      setDecoy((prev) => {
        const next = { ...prev };
        for (let i = 0; i < revealed && i < cats.length; i++) next[cats[i]] = oppBuild[cats[i]];
        return next;
      });
      if (revealed >= cats.length) { setOppShown(oppFinal); setOppDone(true); return; }
      setOppShown(Math.round(oppFinal * (revealed / cats.length)));
      iv = setTimeout(step, stepMs);
    };
    iv = setTimeout(step, stepMs);
    return () => clearTimeout(iv);
  }, []);
  const spent = CATEGORY_ORDER.reduce((s, c) => s + (build[c] ? build[c].price : 0), 0);
  const over = spent > round.budget;
  const filled = CATEGORY_ORDER.filter((c) => build[c]).length;
  const bottleneck = useMemo(() => analyzeBuild(build, round.useCase, round.budget).bottleneck, [build]);
  const shownOpp = (oppIsAI || ghostMode) ? oppShown : oppLocked ? oppFinal : liveOpp ? (oppLiveScore == null ? null : oppLiveScore) : null;
  const shownDone = (oppIsAI || ghostMode) ? oppDone : oppLocked ? true : liveOpp ? !!oppLiveDone : false;
  const mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, "0");
  const low = left <= 15;
  const UC = USE_CASES[round.useCase];
  return (
    <div className="pm-game rf-fade">
      {solo ? (
        <div className="pm-solo-header">
          <div className="pm-solo-title">🎯 Constraint Gauntlet</div>
          <div className={"pm-timer" + (low ? " low" : "")}>{mm}:{ss}</div>
          {constraint && <div className="pm-constraint-banner">⚠️ {constraint.label}</div>}
          <div className="pm-board-sub">{filled}/{CATEGORY_ORDER.length} parts</div>
          {bottleneck && <div style={{fontSize:"0.7rem",color:"var(--c-warn)",marginTop:"2px"}}>⚠️ {bottleneck === "cpu" ? "CPU" : "GPU"} bottleneck</div>}
        </div>
      ) : (
        <div className="pm-vs">
          <div className="pm-board you">
            <div className="pm-board-name">{player && player.startsWith("Player") ? player : "YOU"}</div>
            {myElo != null && <div className="pm-board-elo">{myElo} elo</div>}
            <div className="pm-board-score">?</div>
            <div className="pm-board-sub">{filled}/{CATEGORY_ORDER.length} parts</div>
            {bottleneck && <div style={{fontSize:"0.7rem",color:"var(--c-warn)",marginTop:"2px"}}>⚠️ {bottleneck === "cpu" ? "CPU" : "GPU"} bottleneck</div>}
          </div>
          <div className="pm-vs-mid">
            <div className="pm-vs-word">VS</div>
            <div className={"pm-timer" + (low ? " low" : "")}>{mm}:{ss}</div>
          </div>
          <div className="pm-board opp">
            <div className="pm-board-name">{oppLabel}</div>
            {oppElo != null && <div className="pm-board-elo">{oppElo === "?" ? "? elo" : oppElo + " elo"}</div>}
            <div className="pm-board-score opp">{shownOpp == null ? "—" : shownOpp}</div>
            <div className={"pm-board-sub" + (shownDone ? " locked" : "")}>{shownOpp == null ? "waiting" : shownDone ? "🔒 locked in — waiting for you" : "building…"}</div>
            {oppIsAI && taunt && <div className="pm-taunt">💬 "{taunt}"</div>}
          </div>
        </div>
      )}
      <div className="pm-challenge-row"><span className="pm-uc"><UC.Icon size={16} /> {UC.label}</span><span className="pm-budget">Budget {fmt(round.budget)}</span></div>
      <div className={"pm-spend" + (over ? " over" : "")}>Spent {fmt(spent)} / {fmt(round.budget)}{over && <b> · OVER BUDGET (penalized)</b>} · hard cap {fmt(round.budget + 50)}</div>
      {round.secs <= 60 && (() => {
        const spendPct = Math.min(100, (spent / round.budget) * 100);
        const timePct = Math.min(100, ((round.secs - left) / round.secs) * 100);
        const behind = spendPct < timePct - 15;
        return (
          <div className="pm-pace-wrap">
            <div className="pm-pace-bar">
              <div className={"pm-pace-fill" + (over ? " over" : behind ? " behind" : "")} style={{ width: spendPct + "%" }} />
              <div className="pm-pace-marker" style={{ left: timePct + "%" }} title="Where you should be by now" />
            </div>
            <div className="pm-pace-label">⏱ Pace: {Math.round(spendPct)}% of budget allocated · {Math.round(timePct)}% of time used{behind && !over ? <span className="pm-pace-warn"> · falling behind pace</span> : ""}</div>
          </div>
        );
      })()}
      <div className={"pm-arena" + (solo ? " solo" : "")}>
        <div className="pm-col you">
          <div className="pm-col-h">YOUR BUILD</div>
          {CATEGORY_ORDER.map((c) => { const Icon = CAT_META[c].Icon; const p = build[c]; return (
            <button key={c} className={"pm-ctile" + (p ? " filled" : "")} onClick={() => setOpen(c)}>
              <span className="pm-ctile-img">{p && p.img ? <img src={p.img} alt="" /> : <Icon size={17} />}</span>
              <span className="pm-ctile-body"><span className="pm-ctile-cat">{CAT_META[c].label}</span>{p ? <span className="pm-ctile-name">{p.model || p.name}</span> : <span className="pm-ctile-add">+ Add part</span>}</span>
              {p && <span className="pm-ctile-price">{p.price === 0 ? "Free" : fmt(p.price)}</span>}
            </button>
          ); })}
        </div>
        {!solo && (
          <div className="pm-col opp">
            <div className="pm-col-h">{oppLabel}{oppLocked ? " · locked in" : oppIsAI ? " · building" : ghostMode ? " · replaying" : ""}</div>
            <div className={"pm-col-parts" + (hasOpp ? " blur" : "")}>
              {CATEGORY_ORDER.map((c) => { const Icon = CAT_META[c].Icon; const p = hasOpp ? decoy[c] : null; return (
                <div key={c} className="pm-ctile opp">
                  <span className="pm-ctile-img">{p && p.img ? <img src={p.img} alt="" /> : <Icon size={17} />}</span>
                  <span className="pm-ctile-body"><span className="pm-ctile-cat">{CAT_META[c].label}</span><span className="pm-ctile-name">{p ? (p.model || p.name) : "waiting…"}</span></span>
                </div>
              ); })}
            </div>
            <div className="pm-duel-tip">💡 {DUEL_TIPS[tipIdx]}</div>
          </div>
        )}
      </div>
      <button className="rf-btn rf-btn-lg pm-lockin" onClick={() => onDone(build)}><Check size={16} /> Lock in build</button>
      {open && <MoggerPicker cat={open} current={build[open]} budget={round.budget} spent={spent} useCase={round.useCase} bannedParts={bannedParts} onPick={(o) => { setBuild((b) => ({ ...b, [open]: o })); setOpen(null); }} onClose={() => setOpen(null)} />}
    </div>
  );
}

// Small flavor badge for an archetype tag, reused on result columns, history rows, and ghost cards.
function ArchetypeBadge({ build, useCase, budget }) {
  const arch = useMemo(() => classifyArchetype(build, useCase, budget), [build, useCase, budget]);
  if (!arch) return null;
  return <span className="pm-archetype-badge" title={arch.desc}>{arch.emoji} {arch.tag}</span>;
}

function MoggerScoreCol({ title, build, s, win, shown, rank, useCase, budget }) {
  const big = shown == null ? s.total : shown;
  const gpuName = (build && build.gpu) ? (build.gpu.brand || build.gpu.name || "") : "";
  const isNvidia = /nvidia|rtx|gtx/i.test(gpuName);
  const isAmd = /amd|radeon|rx\s?\d/i.test(gpuName);
  const glowStyle = win ? (isNvidia ? { boxShadow: "0 0 18px rgba(118,185,0,0.35)" } : isAmd ? { boxShadow: "0 0 18px rgba(237,28,36,0.35)" } : undefined) : undefined;
  return (
    <div className={"pm-scorecol" + (win ? " win" : "")} style={glowStyle}>
      <div className="pm-scorecol-head"><span className="pm-scorecol-title">{title}</span>{win && <span className="pm-crown">WINNER</span>}</div>
      {rank && <div className={"pm-rank pm-rank-" + rank.cls + " pm-rank-col"} style={rank.custom ? { color: "#fff", background: hexToRgba(rank.color, 0.2), borderColor: rank.color, boxShadow: "0 0 12px " + hexToRgba(rank.color, 0.45) } : undefined}>{rank.icon} {rank.name}</div>}
      {useCase && budget && <ArchetypeBadge build={build} useCase={useCase} budget={budget} />}
      <div className="pm-bigscore" style={rank ? { color: rank.color } : undefined}>{big}<small>/1000</small></div>
      <div className="pm-metrics"><span>Performance <b>{s.perf}</b></span><span>Compatibility <b>{s.compat}</b></span><span>Spent <b className={s.over ? "pm-red" : ""}>{fmt(s.spend)}</b></span></div>
      {s.issues.length > 0 && <div className="pm-issues">{s.issues.map((i, n) => <span key={n}><AlertTriangle size={11} /> {i}</span>)}</div>}
      <div className="pm-buildlist">
        {CATEGORY_ORDER.map((c) => {
          const p = build[c];
          return (
            <span key={c}>
              {p && p.img
                ? <img src={p.img} alt="" className="pm-buildlist-img" loading="lazy" />
                : <span className="pm-buildlist-icon">{React.createElement(CAT_META[c].Icon, { size: 13 })}</span>}
              <i>{CAT_META[c].label}</i>{p ? (p.model || p.name) : "—"}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// Generates 2 sentences of real spec context for each part, tuned to the use case.
// This goes straight into the AI judge prompt so it can reference actual hardware.
function partJudgeSummary(cat, part, ucKey) {
  if (!part) return `${CAT_META[cat].label}: none selected — costs 0 points in this slot.`;
  const name = part.model || part.name || "Unknown";
  const price = fmt(part.price || 0);
  const maxP = ucMaxPerf(cat, ucKey);
  const pct = maxP > 0 ? Math.round((ucPerf(cat, part, ucKey) / maxP) * 100) : 0;
  const ucLabel = USE_CASES[ucKey].label;
  switch (cat) {
    case "cpu": {
      const cores = part.cores || "?", sock = part.socket || "?", tdp = part.tdp ? part.tdp + "W" : "?W", perf = part.perf || 0;
      const igpuNote = part.igpu ? "Has integrated graphics (important for GPU-less office builds)." : "No integrated graphics — requires a discrete GPU.";
      const ucNote = ucKey === "gaming" ? (/X3D/i.test(name) ? `X3D cache gives a big gaming bonus (+10 pts on top of base perf ${perf}).` : `Gaming rewards raw single-core speed; this scores ${pct}% vs best gaming CPU.`) : ucKey === "content" || ucKey === "workstation" || ucKey === "ai" ? `Productivity use cases weight core count heavily; ${cores} cores + perf ${perf} puts it at ${pct}% of best.` : ucKey === "office" ? `Office caps CPU benefit at perf 80 (diminishing returns past that); scores ${pct}% of best office CPU.` : `Raw perf ${perf}, ${pct}% of best ${ucLabel} CPU.`;
      return `CPU: ${name} (${price}) — ${cores} cores, ${sock}, ${tdp} TDP, base perf score ${perf}. ${igpuNote} ${ucNote}`;
    }
    case "gpu": {
      const vram = part.vram ? part.vram + "GB VRAM" : "VRAM unknown", perf = part.perf || 0;
      const brand = part.brand || ((/nvidia|rtx|gtx/i.test(name)) ? "Nvidia" : (/amd|rx\s/i.test(name)) ? "AMD" : (/arc|intel/i.test(name)) ? "Intel Arc" : "Unknown brand");
      const streamNote = ucKey === "streaming" ? (/nvidia|rtx|gtx/i.test(brand + name) ? `Nvidia card — NVENC hardware encoder gives a streaming perf bonus (×1.4 multiplier).` : `Non-Nvidia card — no NVENC, so streaming perf is penalised vs an equivalent Nvidia GPU.`) : "";
      const vramNote = (ucKey === "ai" || ucKey === "workstation") ? `VRAM is weighted 50% of score for ${ucLabel}; ${vram} is ${part.vram >= 16 ? "strong" : part.vram >= 8 ? "adequate" : "thin"} for this use case.` : "";
      return `GPU: ${name} (${price}) — ${vram}, ${brand}, raw perf ${perf}, scores ${pct}% of best ${ucLabel} GPU. ${streamNote || vramNote || `For ${ucLabel}, GPU is weighted ${USE_CASES[ucKey].alloc.gpu}% of the total score.`}`;
    }
    case "ram": {
      const cap = part.cap ? part.cap + "GB" : "?GB", speed = part.speed ? part.speed + "MT/s" : "?MT/s", type = part.ramType || "DDR5";
      const speedNote = part.speed > 6000 ? `Speed (${speed}) is above the DDR5-6000 sweet spot — faster kits score lower due to diminishing real-world returns.` : part.speed < 5200 ? `Speed (${speed}) is below the ideal range; this pulls the RAM score down.` : `Speed (${speed}) is in the ideal range for real-world performance.`;
      const capNote = (ucKey === "ai" || ucKey === "workstation" || ucKey === "content") ? `Capacity is weighted 60% for ${ucLabel} — ${cap} ${parseInt(cap) >= 32 ? "is solid" : "may be tight"}.` : `Capacity peaks at 32GB for gaming; ${cap} ${parseInt(cap) >= 32 ? "hits the sweet spot" : "leaves room to spare"}.`;
      return `RAM: ${name} (${price}) — ${cap} ${type} @ ${speed}, scores ${pct}% of best ${ucLabel} RAM. ${speedNote} ${capNote}`;
    }
    case "storage": {
      const cap = part.cap ? (part.cap >= 1000 ? (part.cap / 1000).toFixed(1) + "TB" : part.cap + "GB") : "?", perf = part.perf || 0;
      const capNote = (ucKey === "ai" || ucKey === "workstation" || ucKey === "content") ? `Capacity is weighted 50–60% for ${ucLabel} — datasets and project files demand space.` : `Gaming and office reward capacity up to 2TB; beyond that score plateaus.`;
      return `Storage: ${name} (${price}) — ${cap} capacity, transfer perf score ${perf}, scores ${pct}% of best ${ucLabel} drive. ${capNote}`;
    }
    case "mobo": {
      const sock = part.socket || "?", form = part.form || "ATX", rtype = part.ramType || "DDR5", maxRam = part.maxRam ? part.maxRam + "GB max" : "no stated RAM cap";
      return `Motherboard: ${name} (${price}) — ${sock} socket, ${form} form, ${rtype} support, ${maxRam}. Scores ${pct}% — must match CPU socket and RAM type or the build scores 0.`;
    }
    case "cooler": {
      const tdpR = part.tdpRating ? part.tdpRating + "W rated" : "no TDP rating", h = part.height ? part.height + "mm" : "?mm tall", socks = (part.sockets || []).join("/") || "unknown sockets";
      return `Cooler: ${name} (${price}) — ${tdpR}, ${h}, fits ${socks}. Scores ${pct}% — an underpowered cooler vs CPU TDP causes a compat failure and zero score for the whole build.`;
    }
    case "psu": {
      const w = part.watt ? part.watt + "W" : "?W";
      return `PSU: ${name} (${price}) — ${w} output, scores ${pct}%. Must supply ≥125% of the system's estimated draw; going under kills the build's compat check and zeroes the score.`;
    }
    case "case": {
      const maxG = part.maxGpu ? part.maxGpu + "mm GPU" : "no GPU length limit", maxC = part.maxCool ? part.maxCool + "mm cooler" : "no cooler height limit";
      return `Case: ${name} (${price}) — fits ${(part.forms || []).join("/")} boards, ${maxG}, ${maxC}, scores ${pct}%. Physical fit matters — a GPU or cooler that doesn't fit inside triggers a compat failure.`;
    }
    default:
      return `${CAT_META[cat].label}: ${name} (${price}), ${pct}% of best.`;
  }
}

// Five versatility dimensions for the post-match radar chart. Gaming/productivity are
// evaluated against fixed reference use cases (regardless of the actual match's use case)
// so the chart shows how each build would generalize; value/efficiency/balance reflect
// how the build did against the use case it was actually built for.
function radarDims(build, ucKey, budget) {
  const gaming = analyzeBuild(build, "gaming", budget).fitNorm * 100;
  const productivity = (analyzeBuild(build, "content", budget).fitNorm * 100 + analyzeBuild(build, "workstation", budget).fitNorm * 100) / 2;
  const a = analyzeBuild(build, ucKey, budget);
  return { gaming: Math.round(gaming), productivity: Math.round(productivity), value: Math.round(a.ppScore), efficiency: Math.round(a.budgetAdh), balance: Math.round(a.balance) };
}

function DuelRadarChart({ you, opp, youLabel = "You", oppName, useCase, budget }) {
  const dims = ["gaming", "productivity", "value", "efficiency", "balance"];
  const labels = ["Gaming", "Productivity", "Value", "Efficiency", "Balance"];
  const yd = useMemo(() => radarDims(you, useCase, budget), [you, useCase, budget]);
  const od = useMemo(() => radarDims(opp, useCase, budget), [opp, useCase, budget]);
  const [hovDim, setHovDim] = useState(null);
  const n = dims.length, size = 230, cx = size / 2, cy = size / 2, r = 80;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i, val, boost = 1) => { const a = angle(i); const rad = (clamp(val * boost, 0, 100) / 100) * r; return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)]; };
  const ring = (frac) => dims.map((_, i) => { const a = angle(i); return `${cx + r * frac * Math.cos(a)},${cy + r * frac * Math.sin(a)}`; }).join(" ");
  const poly = (d, key) => dims.map((k, i) => {
    const boost = (hovDim === i) ? 1.18 : (hovDim !== null ? 0.94 : 1);
    return pt(i, d[k], boost).join(",");
  }).join(" ");
  return (
    <div className="pm-radar-wrap">
      <svg className="pm-radar" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
        <defs>
          <filter id="radarLiquid" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={hovDim !== null ? "3" : "0"} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((f, i) => <polygon key={i} points={ring(f)} fill="none" stroke="var(--c-border)" strokeWidth="1" opacity={hovDim !== null ? 0.5 : 1} />)}
        {dims.map((_, i) => {
          const [x, y] = pt(i, 100);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={hovDim === i ? "var(--c-accent)" : "var(--c-border)"} strokeWidth={hovDim === i ? "2" : "1"} style={{ transition: "stroke 0.2s, stroke-width 0.2s" }} />;
        })}
        <polygon points={poly(od)} fill="var(--c-bad)" fillOpacity={hovDim !== null ? "0.10" : "0.16"} stroke="var(--c-bad)" strokeWidth="1.5" filter="url(#radarLiquid)" style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }} />
        <polygon points={poly(yd)} fill="var(--c-accent)" fillOpacity={hovDim !== null ? "0.30" : "0.22"} stroke="var(--c-accent)" strokeWidth={hovDim !== null ? "2" : "1.5"} filter="url(#radarLiquid)" style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }} />
        {dims.map((_, i) => {
          const a = angle(i); const lx = cx + (r + 22) * Math.cos(a), ly = cy + (r + 22) * Math.sin(a);
          const isHov = hovDim === i;
          return (
            <g key={i} style={{ cursor: "pointer" }} onMouseEnter={() => setHovDim(i)} onMouseLeave={() => setHovDim(null)}>
              <circle cx={lx} cy={ly} r="18" fill="transparent" />
              <text x={lx} y={ly} fontSize={isHov ? "10.5" : "9.5"} fill={isHov ? "var(--c-accent)" : "var(--c-muted)"} textAnchor="middle" dominantBaseline="middle" fontFamily="'JetBrains Mono',monospace" fontWeight={isHov ? "600" : "400"} style={{ transition: "all 0.2s ease" }}>{labels[i]}</text>
              {isHov && <circle cx={lx} cy={ly} r="20" fill="none" stroke="var(--c-accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />}
            </g>
          );
        })}
        {hovDim !== null && (() => {
          const k = dims[hovDim];
          const [yx, yy] = pt(hovDim, yd[k]);
          const [ox, oy] = pt(hovDim, od[k]);
          return <>
            <circle cx={yx} cy={yy} r="5" fill="var(--c-accent)" opacity="0.9" style={{ filter: "drop-shadow(0 0 6px var(--c-accent))" }} />
            <circle cx={ox} cy={oy} r="5" fill="var(--c-bad)" opacity="0.9" style={{ filter: "drop-shadow(0 0 6px var(--c-bad))" }} />
            <text x={cx} y={cy - 6} fontSize="11" fill="var(--c-accent)" textAnchor="middle" dominantBaseline="middle" fontFamily="'JetBrains Mono',monospace" fontWeight="700">{yd[k]}</text>
            <text x={cx} y={cy + 9} fontSize="9" fill="var(--c-bad)" textAnchor="middle" dominantBaseline="middle" fontFamily="'JetBrains Mono',monospace">{od[k]}</text>
          </>;
        })()}
      </svg>
      <div className="pm-radar-legend">
        <span className="pm-radar-legend-item you"><i /> {youLabel}</span>
        <span className="pm-radar-legend-item opp"><i /> {oppName}</span>
      </div>
    </div>
  );
}

function MoggerResult({ round, you, opp, youLabel = "You", oppName, oppElo, oppTag, oppPersona, myElo, myCrank, eloMsg, practice, series, onAgain, onMenu, onHistory, onSaveBuild, onMirror, onRematch, onNextGame, onAvenge }) {
  const sy = useMemo(() => moggerScore(you, round.useCase, round.budget), [you, opp]);
  const so = useMemo(() => moggerScore(opp, round.useCase, round.budget), [you, opp]);
  // B7: Sudden Death — zero score if over budget
  const sySD = round.suddenDeath && sy.over ? { ...sy, total: 0 } : sy;
  const soSD = round.suddenDeath && so.over ? { ...so, total: 0 } : so;
  const myRank = myElo != null ? moggerRank(myElo, myCrank) : null;
  const oppRank = oppElo != null ? moggerRank(oppElo) : null;
  const youWin = sySD.total >= soSD.total;
  const winnerBuild = youWin ? you : opp;
  const mvpCat = useMemo(() => duelMVP(winnerBuild, round.useCase, round.budget), [you, opp]);
  // Coaching tag: on a loss, find the category that cost the most score (weighted by alloc%)
  const weakCat = useMemo(() => {
    if (youWin) return null;
    let worst = null, worstGap = 0;
    for (const c of CATEGORY_ORDER) {
      const allocW = USE_CASES[round.useCase].alloc[c] || 0;
      if (!allocW) continue;
      const maxP = ucMaxPerf(c, round.useCase);
      const yPct = you[c] && maxP ? (ucPerf(c, you[c], round.useCase) / maxP) * 100 : 0;
      const oPct = opp[c] && maxP ? (ucPerf(c, opp[c], round.useCase) / maxP) * 100 : 0;
      const gap = (oPct - yPct) * allocW;
      if (gap > worstGap) { worstGap = gap; worst = c; }
    }
    return worst;
  }, [you, opp, youWin]);
  // Avenge the Rival: surfaced on a loss vs an AI tier you already have a losing record against
  const rivalInfo = useMemo(() => {
    if (youWin || oppElo == null || !onAvenge) return null;
    try {
      const tier = eloTierName(oppElo);
      const rivals = JSON.parse(localStorage.getItem("mogger_rivals") || "{}");
      const r = rivals[tier];
      if (r && r.l >= 2) return { tier, w: r.w, l: r.l };
    } catch (e) {}
    return null;
  }, [youWin, oppElo, onAvenge]);
  // Build Mentor AI: on a loss, find the single component swap that moves the score the most
  const mentorSwap = useMemo(() => {
    if (youWin) return null;
    const swap = bestMentorSwap(you, round.useCase, round.budget);
    if (!swap) return null;
    return { ...swap, wouldHaveWon: swap.newTotal > soSD.total };
  }, [youWin, you, round.useCase, round.budget, soSD.total]);
  // Open breakdown automatically when you lose so the player sees why
  const [showBreakdown, setShowBreakdown] = useState(!youWin);
  // AI persona post-match quip
  const aiQuip = oppPersona ? (youWin ? pickRand(oppPersona.losses) : pickRand(oppPersona.wins)) : null;
  const [phase, setPhase] = useState("loading"); // loading -> reveal
  const [ay, setAy] = useState(0);
  const [ao, setAo] = useState(0);
  const [verdict, setVerdict] = useState("");
  const [busy, setBusy] = useState(true);
  const [savedYou, setSavedYou] = useState(false);
  const [savedOpp, setSavedOpp] = useState(false);
  const [rCopied, setRCopied] = useState(false);
  const [rateVal, setRateVal] = useState(null);
  // A5: budget efficiency
  const budgEff = sy.spend > 0 ? Math.round((sy.spend / round.budget) * 100) : 0;
  const oppBudgEff = so.spend > 0 ? Math.round((so.spend / round.budget) * 100) : 0;
  // B4: efficiency medal
  const effMedal = sy.total > 0 ? (sy.total >= 900 ? "🥇 Gold Efficiency" : sy.total >= 750 ? "🥈 Silver Efficiency" : sy.total >= 600 ? "🥉 Bronze Efficiency" : null) : null;
  // B5: share result text
  const shareRes = () => {
    const txt = `PC Duels result: ${youWin ? "I won!" : "I lost"} vs ${oppName} | ${USE_CASES[round.useCase].label} · ${fmt(round.budget)} | You: ${sySD.total}/1000 · ${oppName}: ${soSD.total}/1000 | via ForgeAPC`;
    navigator.clipboard.writeText(txt).then(() => { setRCopied(true); setTimeout(() => setRCopied(false), 2500); });
  };
  const saveSide = async (which) => {
    if (!onSaveBuild) return;
    const ucLabel = USE_CASES[round.useCase].label;
    if (which === "you") { await onSaveBuild(you, round.useCase, round.budget, ucLabel + " — Duels"); setSavedYou(true); }
    else { await onSaveBuild(opp, round.useCase, round.budget, oppName + "'s " + ucLabel); setSavedOpp(true); }
  };
  useEffect(() => {
    let dead = false;
    let raf;
    const loadT = setTimeout(() => {
      if (dead) return;
      setPhase("reveal");
      // smooth count-up over 0.8s (easeOutCubic)
      const dur = 800, t0 = performance.now();
      const tick = (now) => {
        const f = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - f, 3);
        setAy(Math.round(sySD.total * e));
        setAo(Math.round(soSD.total * e));
        if (f < 1 && !dead) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      // verdict — full part data so the judge can reference real specs
      const buildBlock = (label, b, s) => {
        const header = `${label} — Score ${s.total}/1000 | perf ${s.perf}% | spent ${fmt(s.spend)} of ${fmt(round.budget)}${s.over ? " (OVER BUDGET)" : ""}${s.dead ? " (INCOMPATIBLE — scored 0)" : ""}`;
        const parts = CATEGORY_ORDER.map((c) => "  • " + partJudgeSummary(c, b[c], round.useCase)).join("\n");
        return header + "\n" + parts;
      };
      const system = `You are the judge of PC Duels in ForgeAPC. You have full spec data for every part. Write exactly 2 sharp sentences: one naming the deciding factor (specific parts and why they mattered for this use case), one calling out the biggest mistake. If a build scored 0, roast the incompatibility. No preamble, no fluff.`;
      const prompt = `USE CASE: ${USE_CASES[round.useCase].label} | BUDGET: ${fmt(round.budget)}\n\n${buildBlock("PLAYER (You)", you, sy)}\n\n${buildBlock(oppName, opp, so)}\n\nDECLARED WINNER: ${youWin ? "PLAYER" : oppName}. Write the verdict now.`;
      const fallback = () => { const w = youWin ? "You" : oppName; const d = Math.abs(sy.total - so.total); const loser = youWin ? so : sy; return `${w} take${youWin ? "" : "s"} it${d < 30 ? " in a photo finish" : d > 150 ? " in a blowout" : ""} — better balance for a ${USE_CASES[round.useCase].label} on ${fmt(round.budget)}. ${loser.dead ? "The other rig had incompatible parts and flatlined at zero." : loser.over ? "The other rig busted the budget." : "It came down to part-for-part value."}`; };
      (async () => {
        try { await streamChat({ system, messages: [{ role: "user", content: prompt }] }, (full) => { if (!dead) setVerdict(full); }); }
        catch (e) { if (!dead) setVerdict(fallback()); }
        finally { if (!dead) setBusy(false); }
      })();
    }, 1000);
    return () => { dead = true; clearTimeout(loadT); if (raf) cancelAnimationFrame(raf); };
  }, []);
  if (phase === "loading") {
    return (
      <div className="pm-result rf-fade">
        <div className="pm-loading">
          <div className="pm-spinner" />
          <div className="pm-loading-text">Scoring both builds…</div>
        </div>
      </div>
    );
  }
  return (
    <div className="pm-result rf-fade">
      {/* A1: Win confetti burst */}
      <ConfettiBurst active={youWin && phase === "reveal"} />
      <h2 className={"pm-verdict-title " + (youWin ? "win" : "lose")}>
        {youWin ? "🏆 YOU WIN" : "💀 YOU LOSE"}
        {/* A6: Close Call badge */}
        {Math.abs(sySD.total - soSD.total) <= 30 && <span className="pm-close-call">⚡ Close Call!</span>}
        {/* Comeback badge: won by 31-79 points */}
        {youWin && Math.abs(sySD.total - soSD.total) > 30 && Math.abs(sySD.total - soSD.total) < 80 && <span className="pm-comeback">🔄 Comeback Win!</span>}
        {round.suddenDeath && <span className="pm-sd-badge">☠️ Sudden Death</span>}
      </h2>
      {oppPersona && (
        <div className="pm-opp-persona">
          <span className="pm-opp-persona-name">{oppName}</span>
          <span className="pm-opp-persona-tag">{oppTag}</span>
          {aiQuip && <span className="pm-opp-persona-quip">"{aiQuip}"</span>}
        </div>
      )}
      <div className="pm-verdict-box"><span className="pm-verdict-tag"><Sparkles size={12} /> AI JUDGE</span>{busy && !verdict ? <p className="pm-dim">Writing the verdict…</p> : <p>{verdict}</p>}</div>
      {eloMsg && (
        <div className={"pm-elo-result " + (eloMsg.delta > 0 ? "up" : eloMsg.delta < 0 ? "down" : "")}>
          <span className="pm-elo-delta">{eloMsg.delta > 0 ? "+" : ""}{eloMsg.delta} ELO</span>
          {/* A2: ELO ticker */}
          <EloTicker oldElo={eloMsg.newElo - eloMsg.delta} newElo={eloMsg.newElo} delta={eloMsg.delta} /> <span className="pm-elo-now-label">total</span>
          {eloMsg.streakMult > 1 && <span className="pm-streak-mult">🔥 {eloMsg.streak}-win streak · +{Math.round((eloMsg.streakMult - 1) * 100)}% bonus</span>}
        </div>
      )}
      {series && (
        <div className="pm-series-banner">
          <span className="pm-series-score">🏆 Series: {youLabel} <b>{series.wins.you}</b> – <b>{series.wins.opp}</b> {oppName}</span>
          {series.done
            ? <span className={"pm-series-result " + (series.winner === "you" ? "win" : "lose")}>{series.winner === "you" ? "You won the series!" : `${oppName} won the series!`}</span>
            : <span className="pm-series-game">Game {series.game} of 3</span>}
        </div>
      )}
      <div className="pm-scorecols">
        <MoggerScoreCol title={youLabel} build={you} s={sySD} win={youWin} shown={ay} rank={myRank} useCase={round.useCase} budget={round.budget} />
        <MoggerScoreCol title={oppName} build={opp} s={soSD} win={!youWin} shown={ao} rank={oppRank} useCase={round.useCase} budget={round.budget} />
      </div>
      <DuelRadarChart you={you} opp={opp} oppName={oppName} youLabel={youLabel} useCase={round.useCase} budget={round.budget} />
      {/* A4: Score breakdown bar chart */}
      {phase === "reveal" && <ScoreBarChart you={you} opp={opp} youLabel={youLabel} oppName={oppName} useCase={round.useCase} budget={round.budget} />}
      {/* B4: efficiency medal */}
      {effMedal && phase === "reveal" && <div className="pm-eff-medal">{effMedal} — Score {sy.total}/1000</div>}
      {/* A5: Budget efficiency row */}
      {phase === "reveal" && <div className="pm-budget-eff-row"><span>Budget used: <b style={{color: budgEff > 100 ? "var(--c-bad)" : budgEff >= 90 ? "var(--c-good)" : "var(--c-warn)"}}>{budgEff}%</b> {youLabel} · <b style={{color: oppBudgEff > 100 ? "var(--c-bad)" : oppBudgEff >= 90 ? "var(--c-good)" : "var(--c-warn)"}}>{oppBudgEff}%</b> {oppName}</span></div>}
      {mvpCat && <div className="pm-mvp-banner">🏅 MVP Part: <b>{winnerBuild[mvpCat] ? (winnerBuild[mvpCat].model || winnerBuild[mvpCat].name) : "—"}</b> <span className="pm-mvp-cat">({CAT_META[mvpCat].label})</span> — biggest score driver for {youWin ? youLabel : oppName}</div>}
      {weakCat && <div className="pm-weak-banner">📉 Costliest category: <b>{CAT_META[weakCat].label}</b> — {oppName}'s pick scored higher here, worth {USE_CASES[round.useCase].alloc[weakCat]}% of your total score.</div>}
      {rivalInfo && (
        <div className="pm-avenge-row">
          <span className="pm-avenge-label">⚔️ Rival alert — you're {rivalInfo.l}-{rivalInfo.w} down vs <b>{rivalInfo.tier}</b> tier opponents.</span>
          <button className="rf-btn pm-avenge-btn" onClick={() => onAvenge(rivalInfo.tier)}>⚔️ Avenge the Rival</button>
        </div>
      )}
      {mentorSwap && (
        <div className="pm-mentor-banner">
          <div className="pm-mentor-head">🧠 Mentor tip{mentorSwap.wouldHaveWon ? " — this swap would have won it" : ""}</div>
          <div className="pm-mentor-body">{mentorExplain(mentorSwap, round.useCase)}</div>
          <div className="pm-mentor-score">Score: {sySD.total} → <b>{mentorSwap.newTotal}</b> ({mentorSwap.wouldHaveWon ? "beats" : "vs"} {oppName}'s {soSD.total})</div>
          {(onRematch || onAgain) && <button className="rf-btn rf-ghost-btn pm-mentor-retry" onClick={onRematch || onAgain}><RotateCcw size={14} /> Retry the duel</button>}
        </div>
      )}
      <button className="rf-btn rf-ghost-btn pm-breakdown-toggle" onClick={() => setShowBreakdown((v) => !v)}>{showBreakdown ? "▲ Hide" : "▼ Show"} part-by-part breakdown</button>
      {showBreakdown && (
        <div className="pm-breakdown">
          <div className="pm-breakdown-head"><span>{youLabel}</span><span>Part</span><span>{oppName}</span></div>
          {CATEGORY_ORDER.map((c) => {
            const yp = you[c], op = opp[c];
            const Icon = CAT_META[c].Icon;
            const yMvp = youWin && mvpCat === c;
            const oMvp = !youWin && mvpCat === c;
            const maxP = ucMaxPerf(c, round.useCase);
            const yPct = yp && maxP ? Math.round(ucPerf(c, yp, round.useCase) / maxP * 100) : 0;
            const oPct = op && maxP ? Math.round(ucPerf(c, op, round.useCase) / maxP * 100) : 0;
            const allocW = USE_CASES[round.useCase].alloc[c] || 0;
            const yAhead = yPct > oPct, tied = yPct === oPct;
            return (
              <div key={c} className="pm-breakdown-row">
                <span className={"pm-breakdown-part" + (yMvp ? " mvp" : "")}>
                  {yp ? (yp.model || yp.name) : "—"}
                  {yMvp && <span className="pm-mvp-tag">🏅</span>}
                  {yp && allocW > 0 && <span className={"pm-bd-pct" + (yAhead ? " win" : tied ? "" : " lose")}>{yPct}%</span>}
                </span>
                <span className="pm-breakdown-cat"><Icon size={11} /> {CAT_META[c].label}{allocW > 0 && <span className="pm-bd-alloc"> {allocW}%</span>}</span>
                <span className={"pm-breakdown-part opp" + (oMvp ? " mvp" : "")}>
                  {op ? (op.model || op.name) : "—"}
                  {oMvp && <span className="pm-mvp-tag">🏅</span>}
                  {op && allocW > 0 && <span className={"pm-bd-pct" + (!yAhead && !tied ? " win" : tied ? "" : " lose")}>{oPct}%</span>}
                </span>
              </div>
            );
          })}
          <div className="pm-breakdown-note">% = how good that part is for <b>{USE_CASES[round.useCase].label}</b> vs best possible · alloc% = weight in score</div>
        </div>
      )}
      {onSaveBuild && phase === "reveal" && (
        <div className="pm-save-row">
          <span className="pm-save-label">Like a build? Save it to My Rigs:</span>
          <div className="pm-save-btns">
            <button className={"pm-save-btn" + (savedYou ? " done" : "")} disabled={savedYou} onClick={() => saveSide("you")}>{savedYou ? <><Check size={14} /> Saved your build</> : <><Save size={14} /> Save your build</>}</button>
            <button className={"pm-save-btn" + (savedOpp ? " done" : "")} disabled={savedOpp} onClick={() => saveSide("opp")}>{savedOpp ? <><Check size={14} /> Saved {oppName}'s</> : <><Save size={14} /> Save {oppName}'s build</>}</button>
          </div>
        </div>
      )}
      {/* Rate this duel */}
      {phase === "reveal" && (
        <div className="pm-rate-row">
          <span className="pm-rate-label">Rate this duel:</span>
          <button className={"pm-rate-btn" + (rateVal === "up" ? " on" : "")} onClick={() => { if (rateVal !== "up") { setRateVal("up"); try { const arr = JSON.parse(localStorage.getItem("mogger_ratings")||"[]"); arr.push({ date: new Date().toLocaleDateString(), useCase: round.useCase, budget: round.budget, rating: "up" }); localStorage.setItem("mogger_ratings", JSON.stringify(arr)); } catch(e) {} } }}>👍</button>
          <button className={"pm-rate-btn" + (rateVal === "down" ? " on" : "")} onClick={() => { if (rateVal !== "down") { setRateVal("down"); try { const arr = JSON.parse(localStorage.getItem("mogger_ratings")||"[]"); arr.push({ date: new Date().toLocaleDateString(), useCase: round.useCase, budget: round.budget, rating: "down" }); localStorage.setItem("mogger_ratings", JSON.stringify(arr)); } catch(e) {} } }}>👎</button>
          {rateVal && <span className="pm-rate-thanks">Thanks for rating!</span>}
        </div>
      )}
      {/* B5: share result */}
      {phase === "reveal" && <div className="pm-row" style={{justifyContent:"center",marginBottom:"4px"}}><button className="rf-btn rf-ghost-btn" onClick={shareRes}>{rCopied ? <><Check size={14}/> Copied!</> : <>📤 Share result</>}</button></div>}
      <div className="pm-row pm-center-row">
        <button className="rf-btn rf-ghost-btn" onClick={onMenu}>Menu</button>
        {onMirror && <button className="rf-btn rf-ghost-btn" onClick={onMirror}><Repeat2 size={16} /> Mirror</button>}
        {series && !series.done && onNextGame ? (
          <button className="rf-btn pm-next-game-btn" onClick={onNextGame}><ChevronRight size={16} /> Next Game ({series.game + 1} of 3)</button>
        ) : (
          <>
            {onRematch && (
              practice
                ? <button className="rf-btn pm-quick-rematch" onClick={onRematch}><RotateCcw size={16} /> Quick Rematch</button>
                : <button className="rf-btn rf-ghost-btn" onClick={onRematch}><RotateCcw size={16} /> Rematch</button>
            )}
            <button className="rf-btn" onClick={onAgain}><Repeat2 size={16} /> Play again</button>
          </>
        )}
      </div>
      <div style={{textAlign:"center",marginTop:"6px",display:"flex",justifyContent:"center",gap:"16px"}}>
        <button style={{fontSize:"0.75rem",color:"var(--c-muted)",background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}} onClick={onMenu}>← Menu</button>
        {onHistory && <button style={{fontSize:"0.75rem",color:"var(--c-accent)",background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}} onClick={onHistory}>📜 View History</button>}
      </div>
    </div>
  );
}

function MoggerLobby({ mode, onStart, onBack }) {
  const [pick, setPick] = useState(false);
  const [uc, setUc] = useState(MOGGER_UCS[0]);
  const [budget, setBudget] = useState(1500);
  const [timer, setTimer] = useState(0);
  const [suddenDeath, setSuddenDeath] = useState(false);
  const host = mode === "local";
  const begin = () => {
    const useCase = (host && pick) ? uc : mRand(MOGGER_UCS);
    const bud = (host && pick) ? budget : mRand(MOGGER_BUDGETS);
    const secs = (host && timer) ? timer : (50 + Math.floor(Math.random() * 370));
    onStart({ useCase, budget: bud, secs, suddenDeath });
  };
  return (
    <div className="pm-card pm-lobby-wide rf-fade">
      <h2 className="pm-h2">{mode === "ai" ? <><Bot size={20} /> vs AI</> : <><Gamepad2 size={20} /> Pass &amp; Play</>}</h2>
      {host && <label className="pm-toggle"><input type="checkbox" checked={pick} onChange={(e) => setPick(e.target.checked)} /><span>Host picks the challenge (off = random)</span></label>}
      {host && pick ? (
        <div className="pm-setup">
          <div className="pm-field"><span className="pm-field-l">Use case</span><div className="pm-chips">{MOGGER_UCS.map((k) => <button key={k} className={"pm-chip" + (uc === k ? " on" : "")} onClick={() => setUc(k)}>{USE_CASES[k].label}</button>)}</div></div>
          <div className="pm-field"><span className="pm-field-l">Budget: {fmt(budget)}</span><input type="range" min="600" max="4000" step="50" value={budget} onChange={(e) => setBudget(+e.target.value)} className="pm-range" /></div>
          <div className="pm-field"><span className="pm-field-l">Timer: {timer ? timer + "s" : "random (50s–7m)"}</span><input type="range" min="0" max="420" step="5" value={timer} onChange={(e) => setTimer(+e.target.value)} className="pm-range" /></div>
        </div>
      ) : <p className="pm-p">The challenge — use case, budget, and a random 50s–7m timer — is revealed when the round starts. Same parts and live prices as the builder. Build fast.</p>}
      <label className="pm-toggle" style={{marginTop:"8px"}}><input type="checkbox" checked={suddenDeath} onChange={e => setSuddenDeath(e.target.checked)} /><span>☠️ Sudden Death — loser gets 0 points if they go over budget</span></label>
      <div className="pm-row"><button className="rf-btn rf-ghost-btn" onClick={onBack}><ChevronLeft size={16} /> Back</button><button className="rf-btn" onClick={begin}>Start round <ChevronRight size={16} /></button><button className="rf-ghost-btn rf-btn" onClick={() => onStart({ useCase: mRand(MOGGER_UCS), budget: mRand(MOGGER_BUDGETS), secs: 60 + Math.floor(Math.random() * 240) })}>⚡ Quick Start</button></div>
    </div>
  );
}

function MoggerIntro({ round, player, oppName, oppTag, onGo }) {
  const [n, setN] = useState(3);
  const UC = USE_CASES[round.useCase];
  useEffect(() => {
    if (n <= 0) { const t = setTimeout(onGo, 650); return () => clearTimeout(t); }
    const t = setTimeout(() => setN(n - 1), 850);
    return () => clearTimeout(t);
  }, [n]);
  return (
    <div className="pm-intro">
      {player && <div className="pm-intro-player">{player}</div>}
      {oppName && (
        <div className="pm-intro-opp">
          <span className="pm-intro-opp-vs">vs</span>
          <span className="pm-intro-opp-name">{oppName}</span>
          {oppTag && <span className="pm-intro-opp-tag">{oppTag}</span>}
        </div>
      )}
      <div className="pm-intro-label">YOUR CHALLENGE</div>
      <div className="pm-intro-uc" key={"uc"}><UC.Icon size={36} /> {UC.label}</div>
      <div className="pm-intro-budget">{fmt(round.budget)} budget</div>
      <div className="pm-intro-count" key={n}>{n > 0 ? n : "BUILD!"}</div>
    </div>
  );
}

function tourNextPow2(n) { let s = 2; while (s < n) s *= 2; return s; }
function tourIsAI(id) { return typeof id === "string" && id.indexOf("AI#") === 0; }

function MoggerTournament({ onExit }) {
  const [phase, setPhase] = useState("entry"); // entry|joinentry|lobby|intro|build|waiting|roundresult|eliminated|champion
  const [code, setCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [round, setRound] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [myOpp, setMyOpp] = useState(null);
  const [results, setResults] = useState(null);
  const [champion, setChampion] = useState(null);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [names, setNames] = useState({});
  const [liveScores, setLiveScores] = useState({});
  const [roundMatches, setRoundMatches] = useState([]);
  const chRef = useRef(null), challengeRef = useRef(null), myBuildRef = useRef(null), cosmeticRef = useRef(null), namesRef = useRef({}), liveScoresRef = useRef({});
  const isHostRef = useRef(false), slotsRef = useRef([]), matchesRef = useRef([]), reportsRef = useRef({}), resolvedRef = useRef(false), roundNumRef = useRef(0), resolveTimer = useRef(null), aiTimersRef = useRef([]);

  const cleanup = () => { if (resolveTimer.current) clearTimeout(resolveTimer.current); aiTimersRef.current.forEach(clearTimeout); aiTimersRef.current = []; netLeave(chRef.current); chRef.current = null; };
  useEffect(() => () => cleanup(), []);

  const label = (id) => id === netId ? (name ? name + " (you)" : "You") : tourIsAI(id) ? "AI" : (namesRef.current[id] || ("Player " + String(id).slice(0, 4)));

  const handleRound = (payload) => {
    setResults(null);
    setRoundMatches(payload.matches);
    liveScoresRef.current = {}; setLiveScores({});
    const secsLeft = Math.max(8, Math.round(payload.challenge.secs - (Date.now() - payload.challenge.startAt) / 1000));
    const ch = { ...payload.challenge, secs: secsLeft };
    challengeRef.current = ch; setChallenge(ch); setRound(payload.round);
    const m = payload.matches.find((x) => x.a === netId || x.b === netId);
    if (m) {
      const opp = m.a === netId ? m.b : m.a;
      setMyOpp(opp);
      cosmeticRef.current = moggerAI(ch.useCase, ch.budget, 400 + Math.random() * 1100);
      myBuildRef.current = null;
      setPhase("intro");
    } else { setMyOpp(null); setPhase("eliminated"); }
  };

  // ---- host bracket engine ----
  const runRound = () => {
    resolvedRef.current = false; reportsRef.current = {};
    const slots = slotsRef.current;
    const matches = [];
    for (let i = 0; i < slots.length; i += 2) matches.push({ a: slots[i], b: slots[i + 1] });
    matchesRef.current = matches;
    const useCase = mRand(MOGGER_UCS), budget = mRand(MOGGER_BUDGETS), secs = 50 + Math.floor(Math.random() * 370);
    const challengePayload = { useCase, budget, secs, startAt: Date.now() };
    chRef.current.send({ type: "broadcast", event: "tour_round", payload: { round: roundNumRef.current, matches, challenge: challengePayload, slots } });
    handleRound({ round: roundNumRef.current, matches, challenge: challengePayload, slots });
    // simulate climbing scores for AI seats so spectators see them tick like real players
    aiTimersRef.current.forEach(clearTimeout); aiTimersRef.current = [];
    matches.flatMap((m) => [m.a, m.b]).filter(tourIsAI).forEach((aid) => {
      const ceiling = 500 + Math.random() * 350, lockAt = secs * (0.55 + Math.random() * 0.3), t0 = Date.now();
      let cur = 0;
      const stepFn = () => {
        if ((Date.now() - t0) / 1000 >= lockAt) return;
        const roll = Math.random();
        const d = roll < 0.18 ? -(50 + Math.random() * 70) : roll < 0.30 ? (120 + Math.random() * 80) : (50 + Math.random() * 70);
        cur = Math.max(0, Math.min(ceiling, cur + d));
        const sc = Math.round(cur);
        liveScoresRef.current = { ...liveScoresRef.current, [aid]: sc }; setLiveScores(liveScoresRef.current);
        try { chRef.current && chRef.current.send({ type: "broadcast", event: "tour_live", payload: { id: aid, score: sc } }); } catch (e) { /* ignore */ }
        aiTimersRef.current.push(setTimeout(stepFn, 1800 + Math.random() * 1000));
      };
      aiTimersRef.current.push(setTimeout(stepFn, 700 + Math.random() * 800));
    });
    if (resolveTimer.current) clearTimeout(resolveTimer.current);
    resolveTimer.current = setTimeout(() => resolveRound(), (secs + 12) * 1000);
  };
  const tryResolve = () => {
    if (resolvedRef.current) return;
    const need = matchesRef.current.flatMap((m) => [m.a, m.b]).filter((id) => !tourIsAI(id));
    if (need.every((id) => reportsRef.current[id])) resolveRound();
  };
  const resolveRound = () => {
    if (resolvedRef.current) return; resolvedRef.current = true;
    if (resolveTimer.current) { clearTimeout(resolveTimer.current); resolveTimer.current = null; }
    aiTimersRef.current.forEach(clearTimeout); aiTimersRef.current = [];
    const ch = challengeRef.current || {};
    const scoreOf = (id) => { if (tourIsAI(id)) { const b = moggerAI(ch.useCase, ch.budget, 400 + Math.random() * 1100); return moggerScore(b, ch.useCase, ch.budget).total; } const r = reportsRef.current[id]; return r ? r.score : 0; };
    const res = matchesRef.current.map((m) => { const a = scoreOf(m.a), b = scoreOf(m.b); return { a: m.a, b: m.b, aScore: a, bScore: b, winner: a >= b ? m.a : m.b }; });
    const winners = res.map((r) => r.winner);
    chRef.current.send({ type: "broadcast", event: "tour_results", payload: { round: roundNumRef.current, results: res, winners } });
    setResults({ round: roundNumRef.current, results: res, winners }); setPhase((p) => p === "champion" ? p : "roundresult");
    if (winners.length === 1) {
      setTimeout(() => { try { chRef.current.send({ type: "broadcast", event: "tour_done", payload: { champion: winners[0] } }); } catch (e) {} setChampion(winners[0]); setPhase("champion"); }, 3500);
    } else { slotsRef.current = winners; roundNumRef.current += 1; setTimeout(() => runRound(), 5000); }
  };

  const wire = (ch) => {
    ch.on("broadcast", { event: "tour_round" }, ({ payload }) => handleRound(payload));
    ch.on("broadcast", { event: "tour_results" }, ({ payload }) => { setResults(payload); setPhase((p) => p === "champion" ? p : "roundresult"); });
    ch.on("broadcast", { event: "tour_done" }, ({ payload }) => { setChampion(payload.champion); setPhase("champion"); });
    ch.on("broadcast", { event: "tour_report" }, ({ payload }) => { if (isHostRef.current) { reportsRef.current[payload.id] = { score: payload.score }; tryResolve(); } });
    ch.on("broadcast", { event: "tour_live" }, ({ payload }) => { liveScoresRef.current = { ...liveScoresRef.current, [payload.id]: payload.score }; setLiveScores(liveScoresRef.current); });
    ch.on("presence", { event: "sync" }, () => {
      const st = ch.presenceState();
      setPlayers(Object.keys(st));
      const nm = {}; for (const k of Object.keys(st)) { const m = st[k] && st[k][0]; if (m && m.name) nm[k] = m.name; }
      namesRef.current = nm; setNames(nm);
    });
  };
  const broadcastLive = (s) => { try { chRef.current && chRef.current.send({ type: "broadcast", event: "tour_live", payload: { id: netId, score: s } }); } catch (e) { /* ignore */ } };

  const doHost = () => {
    isHostRef.current = true; const c = netCode(); setCode(c);
    const ch = netRoom("tour-" + c); chRef.current = ch; wire(ch);
    ch.subscribe((s) => { if (s === "SUBSCRIBED") ch.track({ id: netId, name: name.trim() || "Player", joinedAt: Date.now() }); });
    setPhase("lobby");
  };
  const doJoin = () => {
    const c = joinCode.trim().toUpperCase(); if (c.length < 4) return; setCode(c);
    const ch = netRoom("tour-" + c); chRef.current = ch; wire(ch);
    ch.subscribe((s) => { if (s === "SUBSCRIBED") ch.track({ id: netId, name: name.trim() || "Player", joinedAt: Date.now() }); });
    setStatus("Joined — waiting for the host to start the tournament…"); setPhase("lobby");
  };
  const startTournament = () => {
    const humans = players.slice().sort();
    const size = tourNextPow2(Math.max(2, humans.length));
    const seats = humans.slice(); let k = 1; while (seats.length < size) seats.push("AI#" + (k++));
    slotsRef.current = seats; roundNumRef.current = 1; runRound();
  };

  const onBuildDone = (b) => {
    myBuildRef.current = b;
    const ch = challengeRef.current || {};
    const score = moggerScore(b, ch.useCase, ch.budget).total;
    if (isHostRef.current) { reportsRef.current[netId] = { score }; setPhase("waiting"); tryResolve(); }
    else { try { chRef.current.send({ type: "broadcast", event: "tour_report", payload: { id: netId, score } }); } catch (e) {} setPhase("waiting"); }
  };
  const quit = () => { cleanup(); onExit(); };

  if (phase === "intro" && challenge) return <MoggerIntro round={challenge} player={null} onGo={() => setPhase("build")} />;
  if (phase === "build" && challenge) return <MoggerBuild round={challenge} player="You" oppLabel={tourIsAI(myOpp) ? "AI Opponent" : (myOpp ? label(myOpp) : "Opponent")} oppBuild={cosmeticRef.current} oppIsAI={true} oppLocked={false} onMyScore={broadcastLive} onDone={onBuildDone} />;

  const ResultsList = () => results ? (
    <div className="pm-tour-list">
      {results.results.map((r, i) => (
        <div key={i} className={"pm-tour-match" + ((r.winner === netId) ? " mine-win" : (r.a === netId || r.b === netId) ? " mine-lose" : "")}>
          <span className={r.winner === r.a ? "pm-tour-win" : ""}>{label(r.a)} <b>{r.aScore}</b></span>
          <span className="pm-tour-vs">vs</span>
          <span className={r.winner === r.b ? "pm-tour-win" : ""}>{label(r.b)} <b>{r.bScore}</b></span>
        </div>
      ))}
    </div>
  ) : null;

  return (
    <div className="pm-card pm-center rf-fade">
      {phase === "entry" && (<>
        <h2 className="pm-h2">🏆 Tournament</h2>
        <div className="pm-unranked-tag">Unranked — ranked isn't allowed for tournaments</div>
        <p className="pm-p">A live bracket — winners advance through consecutive rounds until one champion remains. Empty seats are filled by AI.</p>
        <input className="pm-namein" value={name} maxLength={14} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
        <div className="pm-mode-grid">
          <button className="pm-mode" disabled={!name.trim()} onClick={doHost}><span className="pm-mode-icon"><Plus size={22} /></span><span className="pm-mode-name">Host tournament</span><span className="pm-mode-sub">Get a code, gather players</span></button>
          <button className="pm-mode" disabled={!name.trim()} onClick={() => setPhase("joinentry")}><span className="pm-mode-icon"><ChevronRight size={22} /></span><span className="pm-mode-name">Join tournament</span><span className="pm-mode-sub">Enter a code</span></button>
        </div>
        {!name.trim() && <p className="pm-tour-count">Enter a name to continue</p>}
        <button className="rf-ghost pm-exit" onClick={quit}><ChevronLeft size={15} /> Back</button>
      </>)}
      {phase === "joinentry" && (<>
        <h2 className="pm-h2">Join tournament</h2>
        <input className="pm-codein" value={joinCode} maxLength={5} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="CODE" />
        <div className="pm-row"><button className="rf-btn rf-ghost-btn" onClick={() => setPhase("entry")}><ChevronLeft size={16} /> Back</button><button className="rf-btn" onClick={doJoin}>Join <ChevronRight size={16} /></button></div>
      </>)}
      {phase === "lobby" && (<>
        <h2 className="pm-h2">Tournament lobby</h2>
        {isHostRef.current && <div className="pm-code">{code}</div>}
        <p className="pm-p">{isHostRef.current ? "Share this code. Start when everyone has joined." : status}</p>
        <div className="pm-tour-players">{players.map((p) => <span key={p} className={"pm-tour-chip" + (p === netId ? " me" : "")}>{label(p)}</span>)}</div>
        <p className="pm-tour-count">{players.length} player{players.length === 1 ? "" : "s"}{players.length > 1 ? " · bracket of " + tourNextPow2(Math.max(2, players.length)) + (tourNextPow2(Math.max(2, players.length)) > players.length ? " (rest AI)" : "") : ""}</p>
        {isHostRef.current
          ? <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={quit}>Cancel</button><button className="rf-btn" disabled={players.length < 2} onClick={startTournament}>Start tournament <ChevronRight size={16} /></button></div>
          : <><div className="pm-spinner" /><button className="rf-btn rf-ghost-btn" onClick={quit}>Leave</button></>}
      </>)}
      {phase === "waiting" && (<><h2 className="pm-h2">🔒 Locked in · Round {round}</h2><div className="pm-spinner" /><p className="pm-p">Waiting for the round to finish…</p></>)}
      {phase === "roundresult" && (<><h2 className="pm-h2">Round {results ? results.round : round} results</h2><ResultsList /><p className="pm-p">{results && results.winners && results.winners.length > 1 ? "Next round starting…" : "Final result coming up…"}</p></>)}
      {phase === "eliminated" && (<>
        <h2 className="pm-h2">👀 Spectating · Round {round}</h2>
        <p className="pm-p">You were knocked out — watch the live matches below.</p>
        <div className="pm-spec-list">
          {roundMatches.map((m, i) => (
            <div key={i} className="pm-spec-match">
              <div className="pm-spec-side"><span className="pm-spec-name">{label(m.a)}</span><span className="pm-spec-score">{liveScores[m.a] != null ? liveScores[m.a] : "…"}</span></div>
              <span className="pm-vs-word">VS</span>
              <div className="pm-spec-side"><span className="pm-spec-name">{label(m.b)}</span><span className="pm-spec-score">{liveScores[m.b] != null ? liveScores[m.b] : "…"}</span></div>
            </div>
          ))}
        </div>
        {results && <ResultsList />}
        <button className="rf-btn rf-ghost-btn" onClick={quit}>Quit</button>
      </>)}
      {phase === "champion" && (<>
        <h2 className={"pm-verdict-title " + (champion === netId ? "win" : "lose")}>{champion === netId ? "🏆 CHAMPION!" : "🏆 " + label(champion) + " wins"}</h2>
        <p className="pm-p">{champion === netId ? "You won the whole tournament. Mogged everyone." : "Tournament over."}</p>
        <div className="pm-row pm-center-row"><button className="rf-btn" onClick={quit}>Back to menu</button></div>
      </>)}
    </div>
  );
}

function MoggerOnline({ onExit, user, setUser, onNeedAuth, onSaveBuild }) {
  const [phase, setPhase] = useState("menu"); // menu|joinentry|host|join|search|starting|intro|build|waiting|result|left
  const [onlineRanked, setOnlineRanked] = useState(true);
  const [code, setCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [round, setRound] = useState(null);
  const [oppPresent, setOppPresent] = useState(false);
  const [oppBuild, setOppBuild] = useState(null);
  const [aiOpp, setAiOpp] = useState(null);
  const [status, setStatus] = useState("");
  const [oppLiveScore, setOppLiveScore] = useState(null);
  const [oppElo, setOppElo] = useState(null);
  const [aiOppElo, setAiOppElo] = useState(0);
  const [eloMsg, setEloMsg] = useState(null);
  const chRef = useRef(null), lobbyRef = useRef(null), myBuildRef = useRef(null), oppRef = useRef(null), startedRef = useRef(false), pairedRef = useRef(false), roundRef = useRef(null), rankedRef = useRef(false), eloAppliedRef = useRef(false);
  // host settings
  const [pick, setPick] = useState(false);
  const [uc, setUc] = useState(MOGGER_UCS[0]);
  const [budget, setBudget] = useState(1500);
  const [timer, setTimer] = useState(0);
  const myElo = user ? user.elo : null;

  const cleanup = () => { netLeave(chRef.current); netLeave(lobbyRef.current); chRef.current = null; lobbyRef.current = null; };
  useEffect(() => () => cleanup(), []);
  useEffect(() => { if (phase === "waiting" && oppBuild) setPhase("result"); }, [oppBuild, phase]);
  // apply elo after a ranked (Find-a-match) game
  useEffect(() => {
    if (phase !== "result" || !rankedRef.current || !user || eloAppliedRef.current) return;
    if (!myBuildRef.current || !(aiOpp || oppBuild)) return;
    eloAppliedRef.current = true;
    const r = roundRef.current, oppB = aiOpp || oppBuild;
    const sy = moggerScore(myBuildRef.current, r.useCase, r.budget).total;
    const so = moggerScore(oppB, r.useCase, r.budget).total;
    const oElo = aiOpp ? aiOppElo : (oppElo != null ? oppElo : 100);
    let delta = 0;
    if (sy > so) delta = netEloGain(user.elo, oElo);
    else if (sy < so) delta = -netEloGain(oElo, user.elo);
    const newElo = Math.max(0, user.elo + delta);
    setUser({ ...user, elo: newElo }); netSaveElo(user.id, newElo);
    setEloMsg({ delta, newElo });
  }, [phase]);

  const wireRoom = (ch) => {
    ch.on("broadcast", { event: "round_start" }, ({ payload }) => {
      const secsLeft = Math.max(8, Math.round(payload.secs - (Date.now() - payload.startAt) / 1000));
      startedRef.current = true;
      roundRef.current = { ...payload.round, secs: secsLeft };
      setRound({ ...payload.round, secs: secsLeft });
      setPhase("intro");
    });
    ch.on("broadcast", { event: "score" }, ({ payload }) => { setOppLiveScore(payload.score); });
    ch.on("broadcast", { event: "lock_in" }, ({ payload }) => {
      oppRef.current = payload.build || {};
      setOppBuild(payload.build || {});
      const r = roundRef.current; if (r) setOppLiveScore(moggerScore(payload.build || {}, r.useCase, r.budget).total);
    });
    ch.on("presence", { event: "sync" }, () => {
      const st = ch.presenceState();
      const others = Object.keys(st).filter((k) => k !== netId);
      setOppPresent(others.length > 0);
      const om = others[0] && st[others[0]] && st[others[0]][0];
      if (om && typeof om.elo === "number") setOppElo(om.elo);
      if (startedRef.current && others.length === 0) setPhase((p) => (p === "result" ? p : "left"));
    });
  };
  const broadcastScore = (s) => { try { chRef.current && chRef.current.send({ type: "broadcast", event: "score", payload: { score: s } }); } catch (e) { /* ignore */ } };

  const beginRound = (manual) => {
    const useCase = (manual && pick) ? uc : mRand(MOGGER_UCS);
    const bud = (manual && pick) ? budget : mRand(MOGGER_BUDGETS);
    const secs = (manual && pick && timer) ? timer : (50 + Math.floor(Math.random() * 370));
    const r = { useCase, budget: bud, secs };
    chRef.current.send({ type: "broadcast", event: "round_start", payload: { round: r, startAt: Date.now(), secs } });
    startedRef.current = true; roundRef.current = r; setRound(r); setPhase("intro");
  };

  const doHost = () => {
    rankedRef.current = false;
    const c = netCode(); setCode(c);
    const ch = netRoom(c); chRef.current = ch; wireRoom(ch);
    ch.subscribe((s) => { if (s === "SUBSCRIBED") ch.track({ id: netId, role: "host", elo: myElo }); });
    setPhase("host");
  };
  const doJoin = () => {
    rankedRef.current = false;
    const c = joinCode.trim().toUpperCase(); if (c.length < 4) return;
    setCode(c);
    const ch = netRoom(c); chRef.current = ch; wireRoom(ch);
    ch.subscribe((s) => { if (s === "SUBSCRIBED") ch.track({ id: netId, role: "guest", elo: myElo }); });
    setStatus("Joined — waiting for the host to start…"); setPhase("join");
  };

  const joinMatchRoom = (c, role) => {
    setCode(c);
    const ch = netRoom(c); chRef.current = ch; wireRoom(ch);
    ch.subscribe((s) => { if (s === "SUBSCRIBED") ch.track({ id: netId, role, elo: myElo }); });
    setStatus("Matched! Starting…"); setPhase("starting");
    if (role === "host") setTimeout(() => beginRound(false), 1600);
  };
  const startAIFallback = () => {
    const useCase = mRand(MOGGER_UCS), bud = mRand(MOGGER_BUDGETS), secs = 50 + Math.floor(Math.random() * 370);
    const aiElo = 400 + Math.random() * 1100;
    setAiOppElo(aiElo);
    setAiOpp(moggerAI(useCase, bud, aiElo));
    roundRef.current = { useCase, budget: bud, secs };
    setRound({ useCase, budget: bud, secs }); startedRef.current = true; setPhase("intro");
  };
  const doRandom = () => {
    rankedRef.current = onlineRanked;
    pairedRef.current = false;
    const lob = netLobby(); lobbyRef.current = lob;
    lob.on("broadcast", { event: "match" }, ({ payload }) => {
      if (pairedRef.current) return;
      if (payload.a === netId || payload.b === netId) {
        pairedRef.current = true;
        const role = payload.a === netId ? "host" : "guest";
        netLeave(lobbyRef.current); lobbyRef.current = null;
        joinMatchRoom(payload.code, role);
      }
    });
    lob.on("presence", { event: "sync" }, () => {
      if (pairedRef.current) return;
      const st = lob.presenceState();
      const arr = Object.entries(st).map(([k, m]) => ({ id: k, t: (m[0] && m[0].joinedAt) || 0 })).sort((a, b) => a.t - b.t || (a.id < b.id ? -1 : 1));
      if (arr.length >= 2 && arr[0].id === netId) {
        pairedRef.current = true;
        const partner = arr[1], c = netCode();
        lob.send({ type: "broadcast", event: "match", payload: { a: netId, b: partner.id, code: c } });
        netLeave(lobbyRef.current); lobbyRef.current = null;
        joinMatchRoom(c, "host");
      }
    });
    lob.subscribe((s) => { if (s === "SUBSCRIBED") lob.track({ id: netId, joinedAt: Date.now() }); });
    setStatus("Searching for an opponent…"); setPhase("search");
    setTimeout(() => { if (pairedRef.current || startedRef.current) return; pairedRef.current = true; netLeave(lobbyRef.current); lobbyRef.current = null; startAIFallback(); }, 12000);
  };

  const onBuildDone = (b) => {
    myBuildRef.current = b;
    if (aiOpp) { setPhase("result"); return; }
    try { chRef.current && chRef.current.send({ type: "broadcast", event: "lock_in", payload: { build: b } }); } catch (e) { /* ignore */ }
    if (oppRef.current) setPhase("result"); else setPhase("waiting");
  };
  const reset = () => { cleanup(); startedRef.current = false; pairedRef.current = false; rankedRef.current = false; eloAppliedRef.current = false; oppRef.current = null; roundRef.current = null; myBuildRef.current = null; setOppBuild(null); setOppLiveScore(null); setOppElo(null); setEloMsg(null); setAiOpp(null); setRound(null); setOppPresent(false); setCode(""); setJoinCode(""); setPhase("menu"); };

  const aiPers = aiOpp ? aiPersona(aiOppElo) : null;
  const oppName = aiPers ? aiPers.name : "Opponent";
  if (phase === "tournament") return <MoggerTournament onExit={() => setPhase("menu")} />;
  if (phase === "intro" && round) return <MoggerIntro round={round} player={null} oppName={oppName} oppTag={aiPers ? aiPers.tag : null} onGo={() => setPhase("build")} />;
  if (phase === "build" && round) return <MoggerBuild round={round} player="You" oppLabel={oppName} oppBuild={aiOpp || null} oppIsAI={!!aiOpp} oppLocked={false} liveOpp={!aiOpp} oppLiveScore={oppLiveScore} oppLiveDone={!!oppBuild} onMyScore={aiOpp ? undefined : broadcastScore} myElo={myElo} oppElo={aiOpp ? aiOppElo : oppElo} onDone={onBuildDone} />;
  if (phase === "result" && round && myBuildRef.current && (aiOpp || oppBuild)) return <MoggerResult round={round} you={myBuildRef.current} opp={aiOpp || oppBuild} oppName={oppName} oppElo={aiOpp ? aiOppElo : oppElo} oppTag={aiPers ? aiPers.tag : null} oppPersona={aiPers} myElo={myElo} myCrank={user ? user.crank : null} eloMsg={eloMsg} onAgain={reset} onMenu={() => { cleanup(); onExit(); }} onSaveBuild={onSaveBuild} />;

  return (
    <div className="pm-card pm-center rf-fade">
      {phase === "menu" && (<>
        <h2 className="pm-h2">🌐 Online Multiplayer</h2>
        <div className="pm-seg">
          <button className={onlineRanked ? "on" : ""} onClick={() => setOnlineRanked(true)}>Ranked</button>
          <button className={!onlineRanked ? "on" : ""} onClick={() => setOnlineRanked(false)}>Unranked</button>
        </div>
        <p className="pm-seg-note">{onlineRanked ? "Ranked — Find a match puts your elo on the line." : "Unranked — play casually, your elo won't change."}</p>
        <div className="pm-mode-grid pm-mode-grid-top">
          <button className="pm-mode" onClick={doRandom}><span className="pm-mode-icon"><Radio size={22} /></span><span className="pm-mode-name">Find a match</span><span className="pm-mode-sub">{onlineRanked ? "Ranked · random opponent" : "Casual · random opponent"}</span></button>
        </div>
        <div className={"pm-extra-modes" + (onlineRanked ? " collapsed" : "")}>
          <button className="pm-mode" onClick={doHost}><span className="pm-mode-icon"><Plus size={22} /></span><span className="pm-mode-name">Host a room</span><span className="pm-mode-sub">Get a code, play a friend · Unranked</span></button>
          <button className="pm-mode" onClick={() => setPhase("joinentry")}><span className="pm-mode-icon"><ChevronRight size={22} /></span><span className="pm-mode-name">Join a room</span><span className="pm-mode-sub">Enter a friend's code · Unranked</span></button>
          <button className="pm-mode" onClick={() => setPhase("tournament")}><span className="pm-mode-icon">🏆</span><span className="pm-mode-name">Tournament</span><span className="pm-mode-sub">Bracket · 3+ players, AI fills seats · Unranked</span></button>
        </div>
        <button className="rf-ghost pm-exit" onClick={() => { cleanup(); onExit(); }}><ChevronLeft size={15} /> Back</button>
      </>)}

      {phase === "joinentry" && (<>
        <h2 className="pm-h2">Join a room</h2>
        <div className="pm-unranked-tag">Unranked — ranked isn't allowed for private rooms</div>
        <input className="pm-codein" value={joinCode} maxLength={5} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="CODE" />
        <div className="pm-row"><button className="rf-btn rf-ghost-btn" onClick={reset}><ChevronLeft size={16} /> Back</button><button className="rf-btn" onClick={doJoin}>Join <ChevronRight size={16} /></button></div>
      </>)}

      {phase === "host" && (<>
        <h2 className="pm-h2">Your room code</h2>
        <div className="pm-unranked-tag">Unranked — ranked isn't allowed for private rooms</div>
        <div className="pm-code">{code}</div>
        <p className="pm-p">{oppPresent ? "A player joined! Set it up and start." : "Share this code with a friend. Waiting for them to join…"}</p>
        <label className="pm-toggle"><input type="checkbox" checked={pick} onChange={(e) => setPick(e.target.checked)} /><span>Pick the challenge (off = random)</span></label>
        {pick && (<div className="pm-setup">
          <div className="pm-field"><span className="pm-field-l">Use case</span><div className="pm-chips">{MOGGER_UCS.map((k) => <button key={k} className={"pm-chip" + (uc === k ? " on" : "")} onClick={() => setUc(k)}>{USE_CASES[k].label}</button>)}</div></div>
          <div className="pm-field"><span className="pm-field-l">Budget: {fmt(budget)}</span><input type="range" min="600" max="4000" step="50" value={budget} onChange={(e) => setBudget(+e.target.value)} className="pm-range" /></div>
          <div className="pm-field"><span className="pm-field-l">Timer: {timer ? timer + "s" : "random"}</span><input type="range" min="0" max="420" step="5" value={timer} onChange={(e) => setTimer(+e.target.value)} className="pm-range" /></div>
        </div>)}
        <div className="pm-row"><button className="rf-btn rf-ghost-btn" onClick={reset}><ChevronLeft size={16} /> Cancel</button><button className="rf-btn" disabled={!oppPresent} onClick={() => beginRound(true)}>Start round <ChevronRight size={16} /></button></div>
      </>)}

      {phase === "join" && (<><h2 className="pm-h2">🔗 Joined room {code}</h2><div className="pm-spinner" /><p className="pm-p">{status}</p><button className="rf-btn rf-ghost-btn" onClick={reset}>Cancel</button></>)}
      {phase === "search" && (<><h2 className="pm-h2">Finding a match…</h2><div className="pm-spinner" /><p className="pm-p">Looking for another player. If nobody shows up, you will face the AI.</p><button className="rf-btn rf-ghost-btn" onClick={reset}>Cancel</button></>)}
      {phase === "starting" && (<><h2 className="pm-h2">Matched!</h2><div className="pm-spinner" /><p className="pm-p">{status}</p></>)}
      {phase === "waiting" && (<><h2 className="pm-h2">🔒 Locked in</h2><div className="pm-spinner" /><p className="pm-p">Waiting for your opponent to finish…</p></>)}
      {phase === "left" && (<><h2 className="pm-verdict-title win">🏆 YOU WIN</h2><p className="pm-p">Your opponent left the match.</p><div className="pm-row pm-center-row"><button className="rf-btn" onClick={reset}>Back to online menu</button></div></>)}
    </div>
  );
}

function MoggerAuth({ onClose, onAuth }) {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const submit = async () => {
    if (busy) return;
    setBusy(true); setErr("");
    try {
      const res = await (tab === "login" ? netLogIn : netSignUp)(name, pw);
      if (res && res.error) { setErr(res.error); setBusy(false); return; }
      if (res && res.user) { onAuth(res.user); return; }
      setErr("Something went wrong — try again.");
    } catch (e) { setErr("Error: " + (e && e.message ? e.message : "try again")); }
    setBusy(false);
  };
  return (
    <div className="pm-modal-wrap" onClick={onClose}>
      <div className="pm-card pm-auth" onClick={(e) => e.stopPropagation()}>
        <div className="pm-auth-tabs"><button className={tab === "login" ? "on" : ""} onClick={() => { setTab("login"); setErr(""); }}>Log in</button><button className={tab === "signup" ? "on" : ""} onClick={() => { setTab("signup"); setErr(""); }}>Sign up</button></div>
        <input className="pm-namein" value={name} maxLength={14} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input className="pm-namein" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" />
        {tab === "signup" && <p className="pm-auth-hint">8+ characters, at least one number, letters & numbers only.</p>}
        {err && <p className="pm-auth-err">{err}</p>}
        <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={onClose}>Cancel</button><button className="rf-btn" disabled={busy} onClick={submit}>{busy ? "…" : tab === "login" ? "Log in" : "Create account"}</button></div>
        <p className="pm-auth-note">Casual accounts, for elo only — not real security, so don't reuse an important password.</p>
      </div>
    </div>
  );
}

const DIFFS = [{ k: "easy", label: "Easy", elo: 250 }, { k: "medium", label: "Medium", elo: 550 }, { k: "hard", label: "Hard", elo: 1000 }, { k: "random", label: "Random", elo: 0 }, { k: "custom", label: "Custom", elo: 1500 }];

// Rival tiers — same bands used for the rival tracker and the "avenge" rematch.
const ELO_TIERS = [{ name: "Beginner", min: 0, max: 599 }, { name: "Novice", min: 600, max: 1199 }, { name: "Skilled", min: 1200, max: 1799 }, { name: "Expert", min: 1800, max: 2399 }, { name: "Grandmaster", min: 2400, max: 3000 }];
function eloTierName(elo) { return (ELO_TIERS.find((t) => elo >= t.min && elo <= t.max) || ELO_TIERS[0]).name; }
function eloTierRandom(tierName) { const t = ELO_TIERS.find((x) => x.name === tierName) || ELO_TIERS[0]; return t.min + Math.floor(Math.random() * (t.max - t.min + 1)); }

/* ----------------------------- FACTION WARS ----------------------------- */
// Weekly event — the war rotates every week through an 80-theme cycle so it never repeats
// for over a year and a half straight. ~20 of the 80 themes map to a real, detectable build
// trait (so picking hardware that matches your faction earns a small points bonus); the rest
// are pure flavor — still fully playable, just without the hardware-match bonus.
const FACTION_AXES = {
  "cpu-brand": (b) => { const v = b.cpu && b.cpu.brand; return v === "Intel" ? "a" : v === "AMD" ? "b" : null; },
  "gpu-vendor": (b) => { const n = (b.gpu && (b.gpu.model || b.gpu.name)) || ""; if (/nvidia|rtx|gtx/i.test(n)) return "a"; if (/radeon|\brx\s?\d/i.test(n)) return "b"; return null; },
  "cooling": (b) => { const t = b.cooler && b.cooler.type; return t === "air" ? "a" : t === "aio" ? "b" : null; },
  "ram-gen": (b) => { const t = b.ram && b.ram.ramType; return t === "DDR4" ? "a" : t === "DDR5" ? "b" : null; },
  "case-form": (b) => { const f = b.mobo && b.mobo.form; return f === "ITX" ? "a" : f === "ATX" ? "b" : null; },
  "psu-eff": (b) => { const e = b.psu && b.psu.eff; if (!e) return null; return /bronze|silver/i.test(e) ? "a" : "b"; },
  "budget-tier": (b, budget) => { if (!budget) return null; const spend = CATEGORY_ORDER.reduce((s, c) => s + (b[c] ? b[c].price : 0), 0); return spend < budget * 0.6 ? "a" : spend > budget * 0.9 ? "b" : null; },
  "storage-iface": (b) => { const k = b.storage && (b.storage.iface || b.storage.kind); if (!k) return null; return /sata/i.test(k) ? "a" : "b"; },
  "core-count": (b) => { const c = b.cpu && b.cpu.cores; if (!c) return null; return c <= 6 ? "a" : "b"; },
  "vram": (b) => { const v = b.gpu && b.gpu.vram; if (!v) return null; return v <= 8 ? "a" : "b"; },
};
function mkWar(id, label, aLabel, aEmoji, bLabel, bEmoji, axis) {
  return { id, label, a: { key: "a", label: aLabel, emoji: aEmoji }, b: { key: "b", label: bLabel, emoji: bEmoji }, axis: axis || null };
}
const FACTION_WARS = [
  mkWar("w01", "CPU Wars", "Intel", "🔵", "AMD", "🔴", "cpu-brand"),
  mkWar("w02", "Silicon Showdown", "Team Blue", "🔷", "Team Red", "🟥", "cpu-brand"),
  mkWar("w03", "GPU Wars", "Nvidia", "💚", "Radeon", "❤️", "gpu-vendor"),
  mkWar("w04", "Frame Rate Faction", "GeForce Nation", "🟢", "Radeon Rebellion", "🔺", "gpu-vendor"),
  mkWar("w05", "Cooling Wars", "Air-Cooled", "💨", "Liquid", "💧", "cooling"),
  mkWar("w06", "Thermal Throwdown", "Fan Club", "🌬️", "Pump Squad", "🌊", "cooling"),
  mkWar("w07", "Memory Wars", "DDR4", "🟦", "DDR5", "🟪", "ram-gen"),
  mkWar("w08", "Old Guard vs New Wave", "DDR4 Veterans", "📼", "DDR5 Pioneers", "✨", "ram-gen"),
  mkWar("w09", "Form Factor Wars", "Mini-ITX", "📦", "Full Tower", "🏰", "case-form"),
  mkWar("w10", "Small Form Faction", "Pocket Rockets", "🚀", "Tower Titans", "🗼", "case-form"),
  mkWar("w11", "Efficiency Wars", "Bronze Tier", "🥉", "Gold+ Tier", "🥇", "psu-eff"),
  mkWar("w12", "Watt Wars", "Power Savers", "🔋", "Power Hungry", "⚡", "psu-eff"),
  mkWar("w13", "Budget Wars", "Budget Builders", "💵", "Flagship Faithful", "💎", "budget-tier"),
  mkWar("w14", "Value vs Halo", "Value Vanguard", "🛡️", "Halo Hunters", "👑", "budget-tier"),
  mkWar("w15", "Storage Wars", "SATA Sentinels", "💾", "NVMe Nation", "⚡", "storage-iface"),
  mkWar("w16", "Speed Lane", "Old Rails", "🐢", "Fast Lane", "🚄", "storage-iface"),
  mkWar("w17", "Core Wars", "Lean Six", "6️⃣", "Core Overload", "🔢", "core-count"),
  mkWar("w18", "Multitask Wars", "Efficiency Corps", "🎯", "Multitask Mob", "🧵", "core-count"),
  mkWar("w19", "VRAM Wars", "VRAM Minimalists", "🪶", "VRAM Maximalists", "🐘", "vram"),
  mkWar("w20", "Texture Wars", "Texture Tightwads", "📉", "Frame Buffer Fanatics", "📈", "vram"),
  mkWar("w21", "PCIe Wars", "PCIe 4", "4️⃣", "PCIe 5", "5️⃣"),
  mkWar("w22", "Storage Gen Wars", "Gen3 SSDs", "🐌", "Gen5 SSDs", "🚀"),
  mkWar("w23", "Display Wars", "1080p Loyalists", "📺", "4K Believers", "🖥️"),
  mkWar("w24", "Refresh Rate Wars", "60Hz Veterans", "🎞️", "High Refresh Junkies", "⚡"),
  mkWar("w25", "Aspect Ratio Wars", "16:9 Classic", "📐", "Ultrawide Believers", "📏"),
  mkWar("w26", "RGB Wars", "Stealth Black", "🖤", "RGB Everything", "🌈"),
  mkWar("w27", "Overclocking Wars", "Stock Clocks", "📋", "Pushed to the Limit", "🔥"),
  mkWar("w28", "Cable Wars", "Cable Managed", "✨", "Rat's Nest", "🕸️"),
  mkWar("w29", "Window Wars", "Glass Panel", "🪟", "Solid Panel", "⬛"),
  mkWar("w30", "Front Panel Wars", "Mesh Front", "🕳️", "Glass Front", "🔲"),
  mkWar("w31", "Fan Count Wars", "Minimalist Airflow", "🌀", "Fan Wall", "💨"),
  mkWar("w32", "Dust Wars", "Clean Freaks", "🧼", "Dust Collectors", "🌫️"),
  mkWar("w33", "Monitor Count Wars", "Single Monitor", "🖥️", "Multi-Monitor", "🖥️🖥️"),
  mkWar("w34", "Input Wars", "Keyboard & Mouse", "⌨️", "Controller", "🎮"),
  mkWar("w35", "Genre Wars", "FPS Fanatics", "🔫", "RPG Loyalists", "🗡️"),
  mkWar("w36", "Benchmark Wars", "Synthetic Scores", "📊", "Real-World Frames", "🎮"),
  mkWar("w37", "Build Reveal Wars", "Time-Lapse Editors", "🎬", "Livestream Builders", "📡"),
  mkWar("w38", "Sound Profile Wars", "Silent Running", "🤫", "Loud and Proud", "📢"),
  mkWar("w39", "Case Material Wars", "Steel Builders", "🔩", "Aluminum Builders", "🛠️"),
  mkWar("w40", "PSU Modularity Wars", "Fully Modular", "🔌", "Non-Modular Nostalgia", "🧷"),
  mkWar("w41", "GPU Mount Wars", "Horizontal Mount", "➡️", "Vertical Mount", "⬆️"),
  mkWar("w42", "M.2 Wars", "Heatsink Covered", "🛡️", "Bare Boards", "🔓"),
  mkWar("w43", "Build Time Wars", "Speedrunners", "⏱️", "Perfectionists", "🔍"),
  mkWar("w44", "Warranty Wars", "RMA Veterans", "📦", "Never Broke a Part", "🍀"),
  mkWar("w45", "Upgrade Cycle Wars", "Yearly Upgraders", "🔄", "Long Haulers", "⏳"),
  mkWar("w46", "Streaming Codec Wars", "NVENC Encoders", "🎥", "x264 Purists", "🖥️"),
  mkWar("w47", "Sales Event Wars", "Black Friday Hunters", "🛒", "Full Price Payers", "💳"),
  mkWar("w48", "Fan Bearing Wars", "Sleeve Bearing Loyalists", "🌀", "Maglev Believers", "🧲"),
  mkWar("w49", "FPS Counter Wars", "Always-On Overlay", "📈", "Never Shown Purists", "🙈"),
  mkWar("w50", "VRM Wars", "Bare Board Believers", "🔲", "Armored VRM Fans", "🛡️"),
  mkWar("w51", "Case Feet Wars", "Rubber Feet", "🟫", "Metal Feet", "⚙️"),
  mkWar("w52", "Build Platform Wars", "Reddit Posters", "👽", "YouTube Creators", "📹"),
  mkWar("w53", "Multi-GPU Nostalgia", "SLI Believers", "🔗", "Single Card Purists", "🃏"),
  mkWar("w54", "Legacy Hardware Wars", "Retro Rig Collectors", "📼", "Bleeding Edge Adopters", "⚡"),
  mkWar("w55", "BIOS Tuning Wars", "Stock BIOS Defaults", "📄", "Custom Curve Tuners", "🎛️"),
  mkWar("w56", "Fan Curve Wars", "Silent Profile", "🤐", "Max Cooling Profile", "🌬️"),
  mkWar("w57", "Desk Setup Wars", "Standing Desk", "🧍", "Sitting Desk", "🪑"),
  mkWar("w58", "Gaming Chair Wars", "Racing Style", "🏎️", "Ergonomic Office", "🪑"),
  mkWar("w59", "Fuel Wars", "Energy Drinks", "🥤", "Coffee", "☕"),
  mkWar("w60", "Schedule Wars", "Night Owls", "🦉", "Early Birds", "🐦"),
  mkWar("w61", "Build Music Wars", "Lo-fi Beats", "🎧", "Metal Riffs", "🎸"),
  mkWar("w62", "Sleeving Wars", "Custom Sleeved Cables", "🎨", "Stock Cable Loyalists", "📦"),
  mkWar("w63", "Thermal Paste Wars", "Stock Paste Stans", "🧪", "Premium Paste Believers", "⚗️"),
  mkWar("w64", "Capture Card Wars", "Hardware Encode", "📼", "Software Encode", "💻"),
  mkWar("w65", "Build Log Wars", "Spreadsheet Planners", "📊", "Wing-It Builders", "🎲"),
  mkWar("w66", "Part Source Wars", "Local Shop Loyalists", "🏪", "Online Order Diehards", "📦"),
  mkWar("w67", "Extended Warranty Wars", "Always Buy It", "🛡️", "Never Bother", "🎲"),
  mkWar("w68", "Case Fan Wars", "PWM Purists", "🔌", "DC Diehards", "🔋"),
  mkWar("w69", "Cable Length Wars", "Custom Cut Cables", "✂️", "Stock Length Loyalists", "📏"),
  mkWar("w70", "Aesthetic Wars", "Minimalist Builders", "⬜", "Maximalist Builders", "🌈"),
  mkWar("w71", "Lighting Wars", "Static Color", "💡", "Rainbow Cycle", "🌈"),
  mkWar("w72", "Battlestation Wars", "Bedroom Rig", "🛏️", "Office Battlestation", "🏢"),
  mkWar("w73", "Software Tuning Wars", "Default Settings", "⚙️", "Tuned to the Teeth", "🔧"),
  mkWar("w74", "Thermal Camera Wars", "Thermal Camera Users", "📷", "Guess-and-Check Builders", "🤷"),
  mkWar("w75", "Driver Update Wars", "Day-One Updaters", "📥", "If It Ain't Broke Holdouts", "🗝️"),
  mkWar("w76", "Backup Wars", "Cloud Backup Believers", "☁️", "Local Drive Loyalists", "💽"),
  mkWar("w77", "Browser Wars", "Tab Hoarders", "🗂️", "Tab Minimalists", "🧹"),
  mkWar("w78", "Peripheral Wars", "Wired Diehards", "🔌", "Wireless Believers", "📡"),
  mkWar("w79", "Mousepad Wars", "Cloth Pad Loyalists", "🧶", "Hard Pad Believers", "🪵"),
  mkWar("w80", "Headset Wars", "Headset Squad", "🎧", "Speaker Squad", "🔊"),
];
// Fixed epoch so week numbers are stable and monotonically increasing — never resets, never repeats early.
const FACTION_EPOCH = new Date(2026, 0, 1).getTime();
function weekIndexOf(d) { return Math.floor((d.getTime() - FACTION_EPOCH) / (7 * 24 * 60 * 60 * 1000)); }
function factionWarAt(weekIdx) {
  const idx = ((weekIdx % FACTION_WARS.length) + FACTION_WARS.length) % FACTION_WARS.length;
  return { war: FACTION_WARS[idx], weekKey: "W" + weekIdx };
}
function currentFactionWar() { return factionWarAt(weekIndexOf(new Date())); }
function previousFactionWar() { return factionWarAt(weekIndexOf(new Date()) - 1); }
// Which side of the current war this build's relevant part actually belongs to (or null —
// either no axis is defined for this theme, or the build doesn't lean either way).
function buildFactionMatch(build, warId, budget) {
  if (!build) return null;
  const war = FACTION_WARS.find((w) => w.id === warId);
  if (!war || !war.axis) return null;
  const fn = FACTION_AXES[war.axis];
  return fn ? fn(build, budget) : null;
}

const ADMIN_PASS = "Admin2014"; // change this to your own secret
const COADMIN_PASS = "Coadmin2014"; // co-admin password — limited access

function MoggerCoAdmin({ onBack, bypass }) {
  const [authed, setAuthed] = useState(!!bypass);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const tryAuth = () => { if (pw === COADMIN_PASS) { setAuthed(true); } else setErr("Wrong co-admin password."); };

  if (!authed) {
    return (
      <div className="pm-card pm-center rf-fade">
        <h2 className="pm-h2">🔒 Co-Admin</h2>
        <p className="pm-p">Enter the co-admin password to manage accounts.</p>
        <input className="pm-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") tryAuth(); }} placeholder="Co-admin password" />
        {err && <div className="pm-auth-err">{err}</div>}
        <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={onBack}><ChevronLeft size={16} /> Back</button><button className="rf-btn" onClick={tryAuth}>Unlock</button></div>
      </div>
    );
  }

  return <MoggerAdmin onBack={onBack} user={null} isCoadmin={true} />;
}

function MoggerAdmin({ onBack, user, isCoadmin }) {
  const [authed, setAuthed] = useState((user && user.name === "Rayaan") || isCoadmin ? true : false);
  const [pw, setPw] = useState("");
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [eloDraft, setEloDraft] = useState("");
  const [pwDraft, setPwDraft] = useState("");
  const [rankDraft, setRankDraft] = useState("");
  const [colorDraft, setColorDraft] = useState("#ff7ae0");
  const [iconDraft, setIconDraft] = useState("⭐");
  const [ranksDraft, setRanksDraft] = useState([]);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [adminTab, setAdminTab] = useState("accounts");
  const [fbRows, setFbRows] = useState(null);
  const [fbErr, setFbErr] = useState("");
  const [fbDelId, setFbDelId] = useState(null);
  const loadFeedback = async () => { setFbRows(null); setFbErr(""); const r = await netListFeedback(); if (r.error) setFbErr(r.error); setFbRows(r.rows || []); };
  const delFeedback = async (id) => { await netDeleteFeedback(id); setFbRows((prev) => (prev || []).filter((f) => f.id !== id)); setFbDelId(null); };
  const load = async () => { setRows(null); const r = await netAllUsers(); if (r.error) { setErr(r.error); setRows([]); } else { setErr(""); setRows(r.rows); } };
  useEffect(() => { if (authed) load(); }, [authed]);
  const tryAuth = () => { if (pw === ADMIN_PASS) { setAuthed(true); load(); } else setErr("Wrong admin password."); };
  const del = async (id) => {
    setBusyId(id);
    const r = await netDeleteUser(id);
    setBusyId(null); setConfirmId(null);
    if (!r.ok) { setErr(r.error || "Delete failed — did you run the delete-permission SQL?"); return; }
    setRows((prev) => (prev || []).filter((u) => u.id !== id));
  };
  const openRow = (u) => { if (expanded === u.id) { setExpanded(null); return; } setExpanded(u.id); setEloDraft(String(u.elo)); setPwDraft(""); const cr = parseCrank(u.crank); setRanksDraft(cr); setRankDraft(""); setColorDraft("#ff7ae0"); setIconDraft("⭐"); setEmojiOpen(false); setMsg(""); setErr(""); };
  const saveElo = async (u) => {
    const v = parseInt(eloDraft, 10);
    if (isNaN(v) || v < 0 || v > 100000) { setErr("Enter a whole number between 0 and 100000."); return; }
    setBusyId(u.id); const r = await netSetElo(u.id, v); setBusyId(null);
    if (!r.ok) { setErr(r.error || "Could not update elo."); return; }
    setRows((prev) => (prev || []).map((x) => x.id === u.id ? { ...x, elo: v } : x).sort((a, b) => b.elo - a.elo));
    setMsg("Elo updated.");
  };
  const resetPw = async (u) => {
    setMsg(""); setErr("");
    setBusyId(u.id); const r = await netResetPassword(u.id, u.name, pwDraft); setBusyId(null);
    if (!r.ok) { setErr(r.error || "Could not reset password."); return; }
    setRows((prev) => (prev || []).map((x) => x.id === u.id ? { ...x, hash: "(updated)" } : x));
    setPwDraft(""); setMsg("Password reset. Tell the user their new password: " + pwDraft);
  };
  const addRank = () => {
    const nm = rankDraft.trim().slice(0, 24);
    if (!nm) { setErr(["Enter a rank name first."].join("")); return; }
    setRanksDraft((prev) => [...prev, { name: nm, color: colorDraft, icon: iconDraft || "⭐" }]);
    setRankDraft(""); setColorDraft("#ff7ae0"); setIconDraft("⭐"); setErr("");
  };
  const removeRank = (i) => setRanksDraft((prev) => prev.filter((_, idx) => idx !== i));
  const saveRank = async (u) => {
    setMsg(""); setErr("");
    const payload = ranksDraft.length > 0 ? JSON.stringify(ranksDraft) : "";
    setBusyId(u.id); const r = await netSetCustomRank(u.id, payload); setBusyId(null);
    if (!r.ok) { setErr(r.error || "Could not set rank."); return; }
    setRows((prev) => (prev || []).map((x) => x.id === u.id ? { ...x, crank: payload || null } : x));
    setMsg(ranksDraft.length > 0 ? "Ranks saved (" + ranksDraft.length + " badge" + (ranksDraft.length > 1 ? "s" : "") + ")." : "Custom ranks cleared.");
  };
  if (!authed) {
    return (
      <div className="pm-card pm-center rf-fade">
        <h2 className="pm-h2">🔒 Admin</h2>
        <p className="pm-p">Enter the admin password to manage accounts.</p>
        <input className="pm-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") tryAuth(); }} placeholder="Admin password" />
        {err && <div className="pm-auth-err">{err}</div>}
        <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={onBack}><ChevronLeft size={16} /> Back</button><button className="rf-btn" onClick={tryAuth}>Unlock</button></div>
      </div>
    );
  }
  return (
    <div className="pm-card pm-center rf-fade">
      <h2 className="pm-h2">🔒 {isCoadmin ? "Co-Admin" : "Admin"}</h2>
      <div className="rf-community-filters" style={{marginBottom:"14px"}}>
        <button className={"rf-pill" + (adminTab === "accounts" ? " active" : "")} onClick={() => setAdminTab("accounts")}>👤 Accounts</button>
        <button className={"rf-pill" + (adminTab === "feedback" ? " active" : "")} onClick={() => { setAdminTab("feedback"); if (!fbRows) loadFeedback(); }}>📩 Feedback</button>
      </div>
      {adminTab === "accounts" && <>
      {err && <div className="pm-auth-err">{err}</div>}
      {msg && <div className="pm-admin-msg">{msg}</div>}
      {rows == null ? <div className="pm-spinner" /> : rows.length === 0 ? <p className="pm-p">No accounts found.</p> : (
        <div className="pm-lb pm-admin-list">
          {rows.map((u) => (
            <div key={u.id} className="pm-admin-item">
              <div className="pm-lb-row pm-admin-row">
                <button className="pm-admin-open" onClick={() => openRow(u)}><span className="pm-lb-name">{u.name}<RankBadges elo={u.elo} custom={u.crank} /></span></button>
                <span className="pm-lb-elo">{u.elo}</span>
                {isCoadmin ? (
                  <button className="pm-del-btn" disabled title="Co-admins can't delete accounts" style={{opacity:0.35,cursor:"not-allowed"}}><X size={14} /></button>
                ) : confirmId === u.id ? (
                  <span className="pm-admin-confirm"><button className="pm-del-yes" disabled={busyId === u.id} onClick={() => del(u.id)}>{busyId === u.id ? "…" : "Delete"}</button><button className="pm-del-no" onClick={() => setConfirmId(null)}>Cancel</button></span>
                ) : (
                  <button className="pm-del-btn" onClick={() => { setErr(""); setConfirmId(u.id); }}><X size={14} /></button>
                )}
              </div>
              {expanded === u.id && (
                <div className="pm-admin-edit">
                  <div className="pm-admin-line" style={isCoadmin ? {opacity:0.5} : {}}><span className="pm-admin-l">Elo</span><input className="pm-admin-in" value={eloDraft} onChange={(e) => setEloDraft(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" disabled={isCoadmin} /><button className="pm-admin-save" disabled={busyId === u.id || isCoadmin} onClick={() => saveElo(u)}>Save</button></div>
                  <div className="pm-admin-line"><span className="pm-admin-l">Badges</span><span style={{display:"flex",flexWrap:"wrap",gap:4}}>{ranksDraft.length === 0 ? <span style={{color:"var(--c-muted)",fontSize:12}}>none (elo rank)</span> : ranksDraft.map((rk, i) => <span key={i} style={{display:"inline-flex",alignItems:"center",gap:3}}><RankBadge rank={{...rk,cls:"custom",custom:true}} /><button onClick={() => removeRank(i)} style={{background:"none",border:"none",color:"var(--c-muted)",cursor:"pointer",fontSize:12,padding:"0 2px"}}>✕</button></span>)}</span></div>
                  <div className="pm-admin-line"><span className="pm-admin-l">New badge</span><input className="pm-admin-in" value={rankDraft} maxLength={24} onChange={(e) => setRankDraft(e.target.value)} placeholder="badge name" style={{flex:1}} /></div>
                  <div className="pm-admin-line"><span className="pm-admin-l">Color & icon</span><input className="pm-admin-color" type="color" value={colorDraft} onChange={(e) => setColorDraft(e.target.value)} /><button className="pm-emoji-cur" onClick={() => setEmojiOpen((o) => !o)}>{iconDraft || "⭐"} ▾</button><button className="pm-admin-save" disabled={!rankDraft.trim()} onClick={addRank}>+ Add</button></div>
                  {emojiOpen && <MoggerEmojiPicker onPick={(e) => { setIconDraft(e); setEmojiOpen(false); }} />}
                  <div className="pm-admin-line"><span className="pm-admin-l" /><button className="pm-admin-save" disabled={busyId === u.id} onClick={() => saveRank(u)}>Save badges</button><button className="pm-admin-save" style={{marginLeft:6,opacity:0.6}} disabled={busyId === u.id} onClick={() => { setRanksDraft([]); }}>Clear all</button></div>
                  <div className="pm-admin-line"><span className="pm-admin-l">New password</span><input className="pm-admin-in" value={pwDraft} onChange={(e) => setPwDraft(e.target.value)} placeholder="set a new one" /><button className="pm-admin-save" disabled={busyId === u.id || !pwDraft} onClick={() => resetPw(u)}>Reset</button></div>
                  <div className="pm-admin-hash"><span className="pm-admin-l">Stored hash</span><code>{u.hash}</code></div>
                  <p className="pm-admin-hint">Passwords aren't stored — only this one-way hash, so the real password can't be shown. Use "Reset" to set a new one.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={load}>Refresh</button></div>
      </>}
      {adminTab === "feedback" && (
        <div>
          {fbErr && <div className="pm-auth-err">{fbErr}</div>}
          {fbRows == null ? <div className="pm-spinner" /> : fbRows.length === 0 ? <p className="pm-p">No feedback yet.</p> : (
            <div style={{display:"flex",flexDirection:"column",gap:"12px",maxHeight:"60vh",overflowY:"auto"}}>
              {fbRows.map((f) => (
                <div key={f.id} className="pm-admin-item" style={{padding:"12px 14px",borderRadius:"12px",border:"1px solid var(--c-border)",background:"var(--c-panel)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"8px",marginBottom:"6px"}}>
                    <div>
                      <span style={{fontFamily:"'Chakra Petch',sans-serif",fontWeight:700,fontSize:"0.88rem",color:"var(--c-accent2)"}}>{f.user_name || "Anonymous"}</span>
                      <span className="rf-muted" style={{fontSize:"0.72rem",marginLeft:"8px",fontFamily:"'JetBrains Mono',monospace"}}>{f.created_at ? new Date(f.created_at).toLocaleString() : ""}</span>
                    </div>
                    {fbDelId === f.id
                      ? <span style={{display:"flex",gap:"6px"}}><button className="pm-del-yes" onClick={() => delFeedback(f.id)}>Delete</button><button className="pm-del-no" onClick={() => setFbDelId(null)}>Cancel</button></span>
                      : <button className="pm-del-btn" onClick={() => setFbDelId(f.id)}><X size={13}/></button>
                    }
                  </div>
                  <p style={{fontSize:"0.85rem",lineHeight:1.5,margin:"0 0 8px",whiteSpace:"pre-wrap"}}>{f.message}</p>
                  {f.image && <img src={f.image} alt="screenshot" style={{maxWidth:"100%",maxHeight:"200px",objectFit:"contain",borderRadius:"8px",border:"1px solid var(--c-border)"}} />}
                </div>
              ))}
            </div>
          )}
          <div className="pm-row pm-center-row" style={{marginTop:"12px"}}><button className="rf-btn rf-ghost-btn" onClick={loadFeedback}>Refresh</button></div>
        </div>
      )}
      <div className="pm-row pm-center-row" style={{marginTop:"16px"}}><button className="rf-btn rf-ghost-btn" onClick={onBack}><ChevronLeft size={16} /> Back</button></div>
    </div>
  );
}

function MoggerLeaderboard({ onBack, meName }) {
  const [rows, setRows] = useState(null);
  useEffect(() => { netLeaderboard(100).then((r) => setRows(r)); }, []);
  return (
    <div className="pm-card pm-center rf-fade">
      <h2 className="pm-h2">🏆 Global Leaderboard</h2>
      {rows == null ? <div className="pm-spinner" /> : rows.length === 0 ? <p className="pm-p">No ranked players yet — be the first.</p> : (
        <div className="pm-lb">
          {rows.map((r, i) => (
            <div key={i} className={"pm-lb-row" + (r.name === meName ? " me" : "")}>
              <span className="pm-lb-rank">{i + 1}</span>
              <span className="pm-lb-name">{r.name}<RankBadges elo={r.elo} custom={r.crank} /></span>
              <span className="pm-lb-elo">{r.elo}</span>
            </div>
          ))}
        </div>
      )}
      <button className="rf-btn rf-ghost-btn" onClick={onBack}><ChevronLeft size={16} /> Back</button>
    </div>
  );
}

// B2: Confetti
function Confetti() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    el.width = window.innerWidth;
    el.height = window.innerHeight;
    const pieces = Array.from({length:120}, () => ({
      x: Math.random() * el.width, y: Math.random() * -el.height,
      r: 6 + Math.random() * 8, vx: (Math.random()-0.5)*4, vy: 2+Math.random()*4,
      color: ["#19e8db","#7c5cff","#ffd24a","#ff7ae0","#46e0a0"][Math.floor(Math.random()*5)],
      angle: Math.random()*360, spin: (Math.random()-0.5)*8,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,el.width,el.height);
      pieces.forEach(p => {
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.angle*Math.PI/180);
        ctx.fillStyle = p.color; ctx.fillRect(-p.r/2,-p.r/4,p.r,p.r/2); ctx.restore();
        p.x += p.vx; p.y += p.vy; p.angle += p.spin;
        if (p.y > el.height) { p.y = -20; p.x = Math.random()*el.width; }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const t = setTimeout(() => cancelAnimationFrame(raf), 4000);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, []);
  return <canvas ref={canvasRef} style={{position:"fixed",top:0,left:0,pointerEvents:"none",zIndex:9999}} />;
}

/* ---- Feedback modal ---- */
async function compressImage(file, maxW = 600) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}
function FeedbackModal({ user, onClose }) {
  const [msg, setMsg] = useState("");
  const [imgData, setImgData] = useState(null);
  const [imgName, setImgName] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const pickImg = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    setImgName(f.name);
    const d = await compressImage(f); setImgData(d);
  };
  const send = async () => {
    if (!msg.trim()) { setErr("Add a message before sending."); return; }
    setBusy(true); setErr("");
    const r = await netSubmitFeedback(msg.trim(), imgData, user ? user.name : "Anonymous", user ? user.id : null);
    setBusy(false);
    if (!r.ok) { setErr(r.error || "Failed to send."); return; }
    setDone(true);
  };
  return (
    <div className="pm-modal-bg" onClick={onClose}>
      <div className="pm-modal-card rf-fade" onClick={(e) => e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
          <h2 className="pm-h2" style={{margin:0}}>📩 Send Feedback</h2>
          <button className="pm-acct-btn" onClick={onClose}><X size={14}/></button>
        </div>
        {done ? (
          <div style={{textAlign:"center",padding:"24px 0"}}>
            <div style={{fontSize:"2.5rem",marginBottom:"12px"}}>✅</div>
            <p className="pm-p" style={{fontFamily:"'Chakra Petch',sans-serif",fontWeight:600}}>Feedback sent!</p>
            <p className="rf-muted" style={{fontSize:"0.85rem"}}>Thanks — we'll review it shortly.</p>
            <button className="rf-btn" style={{marginTop:"16px"}} onClick={onClose}>Close</button>
          </div>
        ) : (<>
          <p className="rf-muted" style={{fontSize:"0.83rem",marginBottom:"12px"}}>Tell us what's working, what's broken, or what you'd like to see. A screenshot is optional but super helpful.</p>
          <textarea
            className="pm-input"
            rows={4}
            placeholder="Your feedback…"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            style={{width:"100%",resize:"vertical",fontFamily:"'Sora',sans-serif",fontSize:"0.88rem"}}
          />
          <div style={{marginTop:"10px",display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
            <label className="rf-btn rf-ghost-btn" style={{cursor:"pointer",fontSize:"0.82rem"}}>
              📷 {imgName ? imgName : "Attach screenshot"}
              <input type="file" accept="image/*" style={{display:"none"}} onChange={pickImg} />
            </label>
            {imgData && <button className="pm-acct-btn" onClick={() => { setImgData(null); setImgName(""); }}>✕ Remove</button>}
          </div>
          {imgData && <img src={imgData} alt="preview" style={{marginTop:"8px",maxWidth:"100%",maxHeight:"140px",objectFit:"contain",borderRadius:"8px",border:"1px solid var(--c-border)"}} />}
          {err && <div className="pm-auth-err" style={{marginTop:"8px"}}>{err}</div>}
          <div className="pm-row pm-center-row" style={{marginTop:"16px"}}>
            <button className="rf-btn rf-ghost-btn" onClick={onClose}>Cancel</button>
            <button className="rf-btn" disabled={busy || !msg.trim()} onClick={send}>{busy ? "Sending…" : <><Send size={14}/> Send</>}</button>
          </div>
        </>)}
      </div>
    </div>
  );
}

// B1: Achievements
const PRETAUNTS = [
  "I'll build circles around you 🔥",
  "My build will make yours cry 😂",
  "GG before it even starts 🏆",
  "Your parts list is a wish list 💀",
  "Budget? More like a donation to me 💸",
  "I optimize while you agonize 🧠",
];

function getAchievements(hist) {
  const achs = [];
  const wins = hist.filter(h => h.won).length;
  const total = hist.length;
  if (total >= 1) achs.push({ id: "first_blood", icon: "🩸", name: "First Blood", desc: "Played your first duel" });
  if (wins >= 1) achs.push({ id: "first_win", icon: "🏆", name: "First Win", desc: "Won your first duel" });
  if (wins >= 5) achs.push({ id: "five_wins", icon: "⭐", name: "Five Star", desc: "Won 5 duels" });
  if (wins >= 10) achs.push({ id: "veteran", icon: "🎖️", name: "Veteran", desc: "Won 10 duels" });
  const bestScore = hist.reduce((m, h) => Math.max(m, h.myScore || 0), 0);
  if (bestScore >= 900) achs.push({ id: "perfectionist", icon: "💎", name: "Perfectionist", desc: "Scored 900+ in a duel" });
  if (bestScore >= 1000) achs.push({ id: "god_tier", icon: "👑", name: "God Tier", desc: "Scored 1000/1000" });
  const streak = (() => { let max=0,cur=0; [...hist].reverse().forEach(h=>{ if(h.won){cur++;max=Math.max(max,cur);}else cur=0; }); return max; })();
  if (streak >= 3) achs.push({ id: "on_fire", icon: "🔥", name: "On Fire", desc: "3-game win streak" });
  if (streak >= 5) achs.push({ id: "unstoppable", icon: "⚡", name: "Unstoppable", desc: "5-game win streak" });
  return achs;
}

function MoggerAchievements({ onBack }) {
  const hist = useMemo(() => { try { return JSON.parse(localStorage.getItem("mogger_history") || "[]"); } catch(e) { return []; } }, []);
  const achs = useMemo(() => getAchievements(hist), [hist]);
  const ALL_ACHS = [
    { id: "first_blood", icon: "🩸", name: "First Blood", desc: "Play your first duel" },
    { id: "first_win", icon: "🏆", name: "First Win", desc: "Win your first duel" },
    { id: "five_wins", icon: "⭐", name: "Five Star", desc: "Win 5 duels" },
    { id: "veteran", icon: "🎖️", name: "Veteran", desc: "Win 10 duels" },
    { id: "perfectionist", icon: "💎", name: "Perfectionist", desc: "Score 900+ in a duel" },
    { id: "god_tier", icon: "👑", name: "God Tier", desc: "Score 1000/1000" },
    { id: "on_fire", icon: "🔥", name: "On Fire", desc: "3-game win streak" },
    { id: "unstoppable", icon: "⚡", name: "Unstoppable", desc: "5-game win streak" },
  ];
  const unlockedIds = new Set(achs.map(a => a.id));
  return (
    <div className="pm-card rf-fade">
      <h2 className="pm-h2">🏅 Achievements</h2>
      <p className="pm-p pm-dim">{achs.length}/{ALL_ACHS.length} unlocked</p>
      <div className="pm-ach-grid">
        {ALL_ACHS.map(a => (
          <div key={a.id} className={"pm-ach-item" + (unlockedIds.has(a.id) ? " unlocked" : " locked")}>
            <div className="pm-ach-icon">{a.icon}</div>
            <div className="pm-ach-name">{a.name}</div>
            <div className="pm-ach-desc">{a.desc}</div>
          </div>
        ))}
      </div>
      <button className="rf-btn rf-ghost-btn" onClick={onBack}><ChevronLeft size={16} /> Back</button>
    </div>
  );
}

function CoinEloConverter({ balance, userElo, onConvert }) {
  const [coins, setCoins] = useState(5);
  const gain = Math.floor(coins / 5);
  return (
    <div className="pm-coin-converter">
      <div className="pm-coin-converter-head">🪙 Convert coins → ELO <span className="pm-dim">(5:1)</span></div>
      <div className="pm-coin-converter-row">
        <input type="range" min={5} max={Math.min(balance, 500)} step={5} value={coins} onChange={e => setCoins(+e.target.value)} className="pm-range" />
        <span>{coins} coins → <b>+{gain} elo</b></span>
        <button className="pm-coin-convert-btn" onClick={() => onConvert(coins)} disabled={gain < 1}>Convert</button>
      </div>
    </div>
  );
}

/* ======================================================================
   BATCH 3 — Draft Mode, Betting, Rogue Run, Archaeology, Syndicate, Bans
   ====================================================================== */

/* ---- Feature 1: Draft Mode Duel ---- */
const DRAFT_POOL_SIZE = 5;
function aiDraftPick(cat, pool, ucKey) {
  if (!pool || !pool.length) return null;
  return [...pool].sort((a, b) => ucPerf(cat, b, ucKey) - ucPerf(cat, a, ucKey))[0];
}
function MoggerDraft({ onMenu }) {
  const [phase, setPhase] = useState("setup");
  const [ucKey, setUcKey] = useState("gaming");
  const [budget, setBudget] = useState(1500);
  const [ds, setDs] = useState(null);
  const startDraft = () => {
    const pools = {};
    for (const c of CATEGORY_ORDER) pools[c] = moggerOptions(c).slice(0, DRAFT_POOL_SIZE);
    setDs({ catIdx: 0, youFirst: true, subTurn: 0, youBuild: {}, aiBuild: {}, pools });
    setPhase("pick");
  };
  function advance(prev, newYou, newAi, newPools) {
    const nextSub = prev.subTurn + 1;
    if (nextSub >= 2) {
      const nextCat = prev.catIdx + 1;
      if (nextCat >= CATEGORY_ORDER.length) return { ...prev, youBuild: newYou, aiBuild: newAi, pools: newPools, done: true };
      return { ...prev, youBuild: newYou, aiBuild: newAi, pools: newPools, catIdx: nextCat, subTurn: 0, youFirst: !prev.youFirst };
    }
    return { ...prev, youBuild: newYou, aiBuild: newAi, pools: newPools, subTurn: nextSub };
  }
  useEffect(() => {
    if (!ds || phase !== "pick" || ds.done) return;
    const isYourTurn = ds.youFirst ? ds.subTurn === 0 : ds.subTurn === 1;
    if (isYourTurn) return;
    const t = setTimeout(() => {
      setDs(prev => {
        if (!prev) return prev;
        const cat = CATEGORY_ORDER[prev.catIdx];
        const part = aiDraftPick(cat, prev.pools[cat], ucKey);
        if (!part) return prev;
        return advance(prev, prev.youBuild, { ...prev.aiBuild, [cat]: part }, { ...prev.pools, [cat]: prev.pools[cat].filter(p => p !== part) });
      });
    }, 700);
    return () => clearTimeout(t);
  }, [ds, phase, ucKey]);
  useEffect(() => { if (ds?.done) setPhase("done"); }, [ds]);
  const playerPick = (part) => {
    if (!ds) return;
    setDs(prev => {
      if (!prev) return prev;
      const cat = CATEGORY_ORDER[prev.catIdx];
      return advance(prev, { ...prev.youBuild, [cat]: part }, prev.aiBuild, { ...prev.pools, [cat]: prev.pools[cat].filter(p => p !== part) });
    });
  };
  const cat = ds && !ds.done ? CATEGORY_ORDER[ds.catIdx] : null;
  const isYourTurn = ds ? (ds.youFirst ? ds.subTurn === 0 : ds.subTurn === 1) : false;
  const youScore = ds?.done ? moggerScore(ds.youBuild, ucKey, budget) : null;
  const aiScore = ds?.done ? moggerScore(ds.aiBuild, ucKey, budget) : null;
  const youWon = youScore && aiScore ? youScore.total >= aiScore.total : false;
  if (phase === "setup") return (
    <div className="pm-card pm-center rf-fade">
      <h2 className="pm-h2">🃏 Draft Mode Duel</h2>
      <p className="pm-p">Snake-draft parts from a shared pool. Deny your opponent the best components.</p>
      <div className="pm-field"><span className="pm-field-l">Use Case</span>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>
          {MOGGER_UCS.map(k => <button key={k} className={"pm-quick-btn" + (ucKey===k?" pm-seg-on":"")} onClick={() => setUcKey(k)}>{USE_CASES[k].label}</button>)}
        </div>
      </div>
      <div className="pm-field"><span className="pm-field-l">Budget: ${budget}</span><input type="range" min={800} max={3500} step={100} value={budget} onChange={e => setBudget(+e.target.value)} className="pm-range" /></div>
      <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={onMenu}><ChevronLeft size={16}/> Back</button><button className="rf-btn" onClick={startDraft}>Start Draft <ChevronRight size={16}/></button></div>
    </div>
  );
  if (phase === "pick" && ds && !ds.done) {
    const pool = ds.pools[cat] || [];
    return (
      <div className="pm-card rf-fade">
        <h2 className="pm-h2">🃏 Draft — {CAT_META[cat]?.label}</h2>
        <div className="pm-draft-progress">{CATEGORY_ORDER.map((c,i) => <span key={c} className={"pm-draft-pip"+(i<ds.catIdx?" done":i===ds.catIdx?" active":"")} title={CAT_META[c].label}>{CAT_META[c].label.slice(0,3)}</span>)}</div>
        <div className="pm-draft-arena">
          <div className="pm-draft-col"><div className="pm-draft-col-head">YOU</div>{CATEGORY_ORDER.filter(c=>ds.youBuild[c]).map(c=><div key={c} className="pm-draft-item you">{CAT_META[c].label}: {ds.youBuild[c].name.split(" ").slice(0,4).join(" ")}</div>)}</div>
          <div className="pm-draft-col"><div className="pm-draft-col-head ai">AI</div>{CATEGORY_ORDER.filter(c=>ds.aiBuild[c]).map(c=><div key={c} className="pm-draft-item ai">{CAT_META[c].label}: {ds.aiBuild[c].name.split(" ").slice(0,4).join(" ")}</div>)}</div>
        </div>
        {isYourTurn ? (<>
          <p className="pm-draft-turn">Your pick — choose a <b>{CAT_META[cat]?.label}</b>:</p>
          <div className="pm-draft-pool">{pool.map((p,i)=><button key={p.id||i} className="pm-draft-part" onClick={()=>playerPick(p)}><span className="pm-draft-part-name">{p.name.split(" ").slice(0,5).join(" ")}</span><div className="pm-draft-part-meta"><span className="pm-draft-part-price">${p.price}</span><span className="pm-draft-part-perf">{Math.round(ucPerf(cat,p,ucKey)*100)}pts</span></div></button>)}</div>
        </>) : (<div className="pm-draft-ai-thinking">🤖 AI is picking {CAT_META[cat]?.label}…</div>)}
      </div>
    );
  }
  if (phase === "done" && ds) return (
    <div className="pm-card rf-fade">
      <h2 className="pm-h2" style={{textAlign:"center"}}>{youWon?"🏆 You Won the Draft!":"💀 AI Wins the Draft"}</h2>
      <div className="pm-draft-result">
        <div className={"pm-draft-result-col"+(youWon?" win":"")}><div className="pm-draft-result-head">YOU — {youScore?.total||0}</div>{CATEGORY_ORDER.filter(c=>ds.youBuild[c]).map(c=><div key={c} className="pm-draft-item you">{CAT_META[c].label}: {ds.youBuild[c].name.split(" ").slice(0,4).join(" ")} <span style={{opacity:0.55}}>${ds.youBuild[c].price}</span></div>)}</div>
        <div className={"pm-draft-result-col"+(!youWon?" win":"")}><div className="pm-draft-result-head ai">AI — {aiScore?.total||0}</div>{CATEGORY_ORDER.filter(c=>ds.aiBuild[c]).map(c=><div key={c} className="pm-draft-item ai">{CAT_META[c].label}: {ds.aiBuild[c].name.split(" ").slice(0,4).join(" ")} <span style={{opacity:0.55}}>${ds.aiBuild[c].price}</span></div>)}</div>
      </div>
      <div className="pm-row pm-center-row" style={{marginTop:16}}><button className="rf-btn rf-ghost-btn" onClick={startDraft}>Redraft</button><button className="rf-btn" onClick={onMenu}>Menu</button></div>
    </div>
  );
  return null;
}

/* ---- Feature 2: Spectator Betting Market ---- */
function betOdds(myElo, oppElo) {
  const winP = 1 / (1 + Math.pow(10, (oppElo - myElo) / 400));
  return { you: Math.max(1.05, +(1/winP).toFixed(2)), ai: Math.max(1.05, +(1/Math.max(0.01,1-winP)).toFixed(2)), winP: Math.round(winP*100) };
}
function BettingPanel({ myElo, oppElo, balance, onBet, activeBet }) {
  const [side, setSide] = useState("you");
  const [stake, setStake] = useState(Math.min(100, balance || 0));
  const odds = betOdds(myElo||1000, oppElo||1200);
  const myOdds = side==="you" ? odds.you : odds.ai;
  const potPayout = Math.round(stake*myOdds);
  if (activeBet) return (
    <div className="pm-bet-panel active">
      <span>💰 Bet: <b>{activeBet.stake}</b> on <b>{activeBet.side==="you"?"yourself":"AI"}</b> ×{activeBet.odds}</span>
      <span className="pm-bet-potential">→ <b>{Math.round(activeBet.stake*activeBet.odds)}</b> coins</span>
    </div>
  );
  if (!balance || balance <= 0) return null;
  return (
    <div className="pm-bet-panel">
      <div className="pm-bet-head">💰 Bet — Balance: <b>{balance}</b> coins</div>
      <div className="pm-bet-sides">
        <button className={"pm-bet-side"+(side==="you"?" on":"")} onClick={()=>setSide("you")}>You win ({odds.winP}%) × {odds.you}</button>
        <button className={"pm-bet-side"+(side==="ai"?" on":"")} onClick={()=>setSide("ai")}>AI wins ({100-odds.winP}%) × {odds.ai}</button>
      </div>
      <div className="pm-bet-stake"><span>{stake} coins →</span><input type="range" min={10} max={Math.min(balance,500)} step={10} value={stake} onChange={e=>setStake(+e.target.value)} className="pm-range pm-bet-range"/><span className="pm-bet-potential"><b>{potPayout}</b></span></div>
      <button className="rf-btn pm-bet-confirm" onClick={()=>onBet({side,stake,odds:myOdds})}>Place Bet</button>
    </div>
  );
}

/* ---- Feature 3: Rogue Run ---- */
const ROGUE_STAGE_ELOS = [350,700,1150,1700,2400];
const ROGUE_PERKS = [
  {id:"budget_boost",label:"💰 Budget Boost",desc:"+20% budget on all stages",stage:0},
  {id:"extra_cat",label:"⭐ Category Insight",desc:"Peek at AI's best pick for one category",stage:1},
  {id:"score_mult",label:"🎯 Score Multiplier",desc:"+10% to your final score",stage:2},
  {id:"fast_pick",label:"⚡ Extra Time",desc:"+30s on every clock",stage:3},
  {id:"elo_shield",label:"🛡️ ELO Shield",desc:"No ELO loss if you fall at the final stage",stage:4},
];
function rogueModifiers(perks) {
  return { budgetMult:perks.includes("budget_boost")?1.2:1, scoreMult:perks.includes("score_mult")?1.1:1, bonusSecs:perks.includes("fast_pick")?30:0 };
}
function MoggerRogueRun({ onMenu, user }) {
  const currentMonth = new Date().toISOString().slice(0,7);
  const [phase, setPhase] = useState("intro");
  const [stageIdx, setStageIdx] = useState(0);
  // Rewards are temporary: {id, label, matchesLeft} — reset each month
  const [rewards, setRewards] = useState(()=>{
    try {
      const stored = JSON.parse(localStorage.getItem("mogger_rogue_rewards")||"null");
      if(!stored || stored.month !== currentMonth) return {month:currentMonth,list:[],ran:false};
      return stored;
    } catch(e){return {month:currentMonth,list:[],ran:false};}
  });
  const [bestStage, setBestStage] = useState(()=>{try{return+(localStorage.getItem("mogger_rogue_best")||"0");}catch(e){return 0;}});
  const [results, setResults] = useState([]);
  const [aiOpponent, setAiOpponent] = useState(null);
  const [unlocked, setUnlocked] = useState(null);
  const saveRewards = (r) => { setRewards(r); try{localStorage.setItem("mogger_rogue_rewards",JSON.stringify(r));}catch(e){} };
  const canRun = !rewards.ran;
  const perks = rewards.list.map(r=>r.id);
  const mods = rogueModifiers(perks);
  const ucKey = MOGGER_UCS[stageIdx%MOGGER_UCS.length];
  const budget = Math.round(MOGGER_BUDGETS[stageIdx%MOGGER_BUDGETS.length]*mods.budgetMult);
  const secs = 90+mods.bonusSecs;
  const currentElo = ROGUE_STAGE_ELOS[stageIdx];
  const startStage = ()=>{ setAiOpponent(moggerAI(ucKey,budget,currentElo)); setPhase("stage"); };
  const finishStage = (build)=>{
    const aiB = aiOpponent||moggerAI(ucKey,budget,currentElo);
    const myS = moggerScore(build,ucKey,budget), aiS = moggerScore(aiB,ucKey,budget);
    const myTotal = Math.round(myS.total*mods.scoreMult);
    const won = myTotal>=aiS.total;
    const newR = [...results,{stage:stageIdx+1,elo:currentElo,won,myScore:myTotal,aiScore:aiS.total}];
    setResults(newR);
    if(won){
      const perk=ROGUE_PERKS.find(p=>p.stage===stageIdx&&!perks.includes(p.id));
      let newList=rewards.list;
      if(perk){
        const newReward={id:perk.id,label:perk.label,desc:perk.desc,matchesLeft:3};
        newList=[...rewards.list,newReward];
        setUnlocked(perk);
      }
      const next=stageIdx+1;
      if(next>=ROGUE_STAGE_ELOS.length){
        const nb=Math.max(bestStage,next);setBestStage(nb);try{localStorage.setItem("mogger_rogue_best",String(nb));}catch(e){}
        const nr={...rewards,list:newList,ran:true};saveRewards(nr);
        if(user?.id)netSaveRogueRun(user.id,next,true,newList.map(r=>r.id));setPhase("done");
      } else {saveRewards({...rewards,list:newList});setStageIdx(next);setPhase("stage-win");}
    } else {
      const nb=Math.max(bestStage,stageIdx);setBestStage(nb);try{localStorage.setItem("mogger_rogue_best",String(nb));}catch(e){}
      saveRewards({...rewards,ran:true});
      if(user?.id)netSaveRogueRun(user.id,stageIdx,false,perks);setPhase("done");
    }
  };
  if(phase==="intro")return(
    <div className="pm-card pm-center rf-fade">
      <h2 className="pm-h2">⚔️ Rogue Run</h2>
      <p className="pm-p">Beat 5 escalating AI opponents. Each win grants a temporary reward active for <b>3 ranked matches</b>. One run per month.</p>
      {!canRun&&<div className="pm-rogue-used">✅ Run complete for {currentMonth}. Resets next month.</div>}
      <div className="pm-rogue-stages">{ROGUE_STAGE_ELOS.map((elo,i)=>{const perk=ROGUE_PERKS[i];const hasReward=rewards.list.find(r=>r.id===perk?.id);return(<div key={i} className={"pm-rogue-stage"+(i<bestStage?" cleared":"")}><span className="pm-rogue-stage-num">Stage {i+1}</span><span className="pm-rogue-elo">{elo} ELO</span>{perk&&<span className={"pm-rogue-perk-badge"+(hasReward?" owned":"")}>{perk.label}{hasReward?` (${hasReward.matchesLeft} left)`:""}</span>}</div>);})}</div>
      {rewards.list.length>0&&<div className="pm-rogue-active-perks"><div className="pm-rogue-perks-label">This month's rewards:</div>{rewards.list.map(r=><div key={r.id} className="pm-rogue-perk-row">{r.label} — {r.matchesLeft} ranked matches left</div>)}</div>}
      {bestStage>0&&<div className="pm-rogue-best">🏆 Best: Stage {bestStage}</div>}
      <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={onMenu}><ChevronLeft size={16}/> Back</button><button className="rf-btn" onClick={()=>{setStageIdx(0);setResults([]);setUnlocked(null);startStage();}} disabled={!canRun}>{canRun?"Start Run":"Done for this month"} <ChevronRight size={16}/></button></div>
    </div>
  );
  if(phase==="stage"&&aiOpponent)return(
    <div className="pm-card rf-fade pm-rogue-stage-wrap">
      <div className="pm-rogue-stage-header"><h2 className="pm-h2">⚔️ Stage {stageIdx+1}/{ROGUE_STAGE_ELOS.length}</h2><div className="pm-rogue-stage-meta"><span className="pm-rogue-elo-badge">{currentElo} ELO</span><span>{USE_CASES[ucKey]?.label} · ${budget} · {secs}s</span></div>{perks.length>0&&<div className="pm-rogue-perks-chips">{perks.map(pid=>{const p=ROGUE_PERKS.find(x=>x.id===pid);return p?<span key={pid} className="pm-rogue-perk-chip">{p.label}</span>:null;})}</div>}</div>
      <MoggerBuild round={{useCase:ucKey,budget,secs}} player="You" oppLabel={"AI — "+currentElo+" ELO"} oppBuild={aiOpponent} oppIsAI={true} oppLocked={false} onDone={finishStage}/>
    </div>
  );
  if(phase==="stage-win"){const last=results[results.length-1];return(
    <div className="pm-card pm-center rf-fade">
      <h2 className="pm-h2" style={{color:"var(--c-good)"}}>✅ Stage {last?.stage} Cleared!</h2>
      <div className="pm-rogue-score-row"><div>You: <b>{last?.myScore}</b></div><div className="pm-rogue-vs">VS</div><div>AI: <b>{last?.aiScore}</b></div></div>
      {unlocked&&<div className="pm-rogue-perk-unlock">🎁 Perk Unlocked: <b>{unlocked.label}</b><br/><span className="pm-rogue-perk-desc">{unlocked.desc}</span></div>}
      <div className="pm-rogue-next-preview">Next: Stage {stageIdx+1} · {ROGUE_STAGE_ELOS[stageIdx]} ELO</div>
      <button className="rf-btn" onClick={()=>{setUnlocked(null);startStage();}}>Next Stage <ChevronRight size={16}/></button>
    </div>
  );}
  if(phase==="done"){const cleared=results.length>=ROGUE_STAGE_ELOS.length&&results.every(r=>r.won);return(
    <div className="pm-card rf-fade pm-center">
      <h2 className="pm-h2">{cleared?"🏆 ROGUE CLEARED!":"💀 Run Over"}</h2>
      {cleared?<p className="pm-p">All 5 stages defeated. You are unstoppable.</p>:<p className="pm-p">You reached Stage {results.length}.</p>}
      <div className="pm-rogue-results">{results.map((r,i)=><div key={i} className={"pm-rogue-result-row"+(r.won?" won":" lost")}><span>Stage {r.stage}</span><span className="pm-rogue-result-elo">{r.elo}</span><span>{r.won?"✓":"✗"}</span><span>You {r.myScore} · AI {r.aiScore}</span></div>)}</div>
      <div className="pm-row pm-center-row" style={{marginTop:16}}><button className="rf-btn rf-ghost-btn" onClick={()=>{setStageIdx(0);setResults([]);setUnlocked(null);setPhase("intro");}}>View Perks</button><button className="rf-btn" onClick={onMenu}>Menu</button></div>
    </div>
  );}
  return null;
}

/* ---- Feature 4: Build Archaeology ---- */
function MoggerArchaeology({ onMenu, onReplay }) {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  useEffect(()=>{ netListCommunity(100).then(res=>{ setLoading(false); if(Array.isArray(res))setBuilds(res); else setErr("Could not load community builds."); }); },[]);
  const byMonth = useMemo(()=>{
    const g={};
    for(const b of builds){
      const d=b.created_at?new Date(b.created_at):new Date();
      const key=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");
      const label=d.toLocaleString("default",{month:"long",year:"numeric"});
      if(!g[key])g[key]={label,builds:[]};
      g[key].builds.push(b);
    }
    return Object.entries(g).sort((a,b)=>b[0].localeCompare(a[0]));
  },[builds]);
  return(
    <div className="pm-card rf-fade pm-arch-wrap">
      <div className="pm-arch-head"><h2 className="pm-h2">🏛️ Build Archaeology</h2><button className="rf-btn rf-ghost-btn" onClick={onMenu}><ChevronLeft size={15}/> Back</button></div>
      <p className="pm-p pm-dim">Community builds by month. Replay any as a Ghost Duel.</p>
      {loading&&<div className="pm-loading">Loading…</div>}
      {err&&<div className="pm-err">{err}</div>}
      {byMonth.map(([key,group])=>(
        <div key={key} className="pm-arch-month">
          <div className="pm-arch-month-head">{group.label}</div>
          {group.builds.map((b,i)=>(
            <div key={i} className="pm-arch-build">
              <div className="pm-arch-build-info"><span className="pm-arch-build-name">{b.title||b.name||"Unnamed Build"}</span><span className="pm-arch-build-uc">{USE_CASES[b.use_case]?.label||b.use_case}</span><span className="pm-arch-build-budget">${b.budget}</span>{(b.total||b.score)!=null&&<span className="pm-arch-build-score">{b.total||b.score}</span>}</div>
              {(b.parts||b.build)&&<button className="pm-arch-replay" onClick={()=>onReplay({id:"arch-"+Date.now()+i,label:(b.title||b.name||"Community Build")+" — "+(new Date(b.created_at||Date.now()).toLocaleDateString()),useCase:b.use_case,budget:b.budget,secs:90,build:b.parts||b.build,score:b.total||b.score,date:b.created_at?new Date(b.created_at).toLocaleDateString():"",})}>👻 Replay</button>}
            </div>
          ))}
        </div>
      ))}
      {!loading&&!err&&builds.length===0&&<div className="pm-arch-empty">No community builds yet. Share your best build to contribute!</div>}
    </div>
  );
}

/* ---- Feature 5: Collaborative Syndicate Builds ---- */
function MoggerSyndicate({ onMenu, user }) {
  const [phase, setPhase] = useState("setup");
  const [code, setCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [claims, setClaims] = useState({});
  const [picks, setPicks] = useState({});
  const [myCat, setMyCat] = useState(null);
  const [ucKey, setUcKey] = useState("gaming");
  const [budget, setBudget] = useState(1500);
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [channel, setChannel] = useState(null);
  const chatRef = useRef(null);
  const myId = user?.id ? String(user.id) : netId;
  const myName = user?.name || ("Guest_"+netId.slice(0,4));
  useEffect(()=>{ if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight; },[chat]);
  useEffect(()=>{ return ()=>{ if(channel)netLeave(channel); }; },[channel]);
  const joinRoom = (c) => {
    if(channel)netLeave(channel);
    const ch = netSupabase.channel("mogger-synd-"+c,{config:{broadcast:{self:true},presence:{key:myId}}});
    ch.on("broadcast",{event:"claim"},({payload})=>setClaims(prev=>({...prev,[payload.cat]:{userId:payload.userId,name:payload.name}})));
    ch.on("broadcast",{event:"pick"},({payload})=>setPicks(prev=>({...prev,[payload.cat]:payload.part})));
    ch.on("broadcast",{event:"chat"},({payload})=>setChat(prev=>[...prev,payload]));
    ch.on("broadcast",{event:"cfg"},({payload})=>{setUcKey(payload.ucKey);setBudget(payload.budget);});
    ch.on("presence",{event:"sync"},()=>{ const state=ch.presenceState(); setPlayers(Object.values(state).flat().map(p=>({id:String(p.id),name:p.name}))); });
    ch.subscribe(async(status)=>{ if(status==="SUBSCRIBED"){await ch.track({id:myId,name:myName});setPhase("lobby");} });
    setChannel(ch); setCode(c);
  };
  const createRoom=()=>joinRoom(netCode(5));
  const isHost=players.length>0&&players[0]?.id===myId;
  const claimCat=(cat)=>{ if(claims[cat]||!channel)return; setMyCat(cat); channel.send({type:"broadcast",event:"claim",payload:{cat,userId:myId,name:myName}}); setClaims(prev=>({...prev,[cat]:{userId:myId,name:myName}})); };
  const sendChat=()=>{ if(!chatInput.trim()||!channel)return; channel.send({type:"broadcast",event:"chat",payload:{name:myName,text:chatInput.trim()}}); setChatInput(""); };
  const submitPick=(part)=>{ if(!channel||!myCat)return; channel.send({type:"broadcast",event:"pick",payload:{cat:myCat,part}}); setPicks(prev=>({...prev,[myCat]:part})); };
  const updateCfg=(u,b)=>{ setUcKey(u);setBudget(b); channel?.send({type:"broadcast",event:"cfg",payload:{ucKey:u,budget:b}}); };
  const aiOpp=useMemo(()=>phase==="result"?moggerAI(ucKey,budget,1200):null,[phase,ucKey,budget]);
  const syndScore=phase==="result"?moggerScore(picks,ucKey,budget):null;
  const aiScore=phase==="result"&&aiOpp?moggerScore(aiOpp,ucKey,budget):null;
  if(phase==="setup")return(<div className="pm-card pm-center rf-fade"><h2 className="pm-h2">🤝 Syndicate Build</h2><p className="pm-p">3–5 players each own one PC category. Build together, face the AI.</p><div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={onMenu}><ChevronLeft size={16}/> Back</button><button className="rf-btn rf-ghost-btn" onClick={()=>setPhase("join")}>Join Room</button><button className="rf-btn" onClick={createRoom}>Create Room</button></div></div>);
  if(phase==="join")return(<div className="pm-card pm-center rf-fade"><h2 className="pm-h2">🤝 Join Syndicate</h2><input className="rf-input" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="Enter room code…" maxLength={5} style={{marginBottom:12}}/><div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={()=>setPhase("setup")}><ChevronLeft size={16}/> Back</button><button className="rf-btn" onClick={()=>joinRoom(code)} disabled={!code.trim()}>Join</button></div></div>);
  if(phase==="lobby")return(
    <div className="pm-card rf-fade pm-synd-lobby">
      <h2 className="pm-h2">🤝 Syndicate — <code className="pm-synd-code">{code}</code></h2>
      <p className="pm-p pm-dim">Share this code. Each player claims one category to build.</p>
      <div className="pm-synd-players">{players.map(p=><span key={p.id} className={"pm-synd-player"+(p.id===myId?" me":"")}>{p.name}</span>)}</div>
      {isHost&&<div className="pm-synd-cfg">
        <div className="pm-field" style={{marginBottom:6}}><span className="pm-field-l">Use Case</span><div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>{["gaming","content","ai","office"].map(k=><button key={k} className={"pm-quick-btn"+(ucKey===k?" pm-seg-on":"")} onClick={()=>updateCfg(k,budget)}>{USE_CASES[k].label}</button>)}</div></div>
        <div className="pm-field"><span className="pm-field-l">Budget: ${budget}</span><input type="range" min={800} max={3500} step={100} value={budget} onChange={e=>updateCfg(ucKey,+e.target.value)} className="pm-range"/></div>
      </div>}
      <div className="pm-synd-cats">{CATEGORY_ORDER.map(cat=>{const clm=claims[cat];const isMine=clm?.userId===myId;return(<button key={cat} className={"pm-synd-cat"+(isMine?" mine":clm?" taken":"")} onClick={()=>!clm&&claimCat(cat)} disabled={!!clm&&!isMine}><span>{CAT_META[cat].label}</span>{clm&&<span className="pm-synd-cat-owner">{isMine?"You":clm.name}</span>}</button>);})}</div>
      {myCat&&<div className="pm-synd-myclaim">✅ Your category: <b>{CAT_META[myCat]?.label}</b></div>}
      <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={()=>{netLeave(channel);setChannel(null);setPhase("setup");}}><ChevronLeft size={16}/> Leave</button>{myCat&&<button className="rf-btn" onClick={()=>setPhase("build")}>Build My Part <ChevronRight size={16}/></button>}</div>
    </div>
  );
  if(phase==="build"){const pool=myCat?moggerOptions(myCat).slice(0,12):[];return(
    <div className="pm-card rf-fade">
      <h2 className="pm-h2">🤝 Pick — {CAT_META[myCat]?.label}</h2>
      <p className="pm-p pm-dim">{USE_CASES[ucKey]?.label} · ${budget}</p>
      <div className="pm-synd-status">{CATEGORY_ORDER.map(c=><span key={c} className={"pm-synd-status-cat"+(picks[c]?" done":claims[c]?" claimed":"")}>{CAT_META[c].label.slice(0,3)}{picks[c]?" ✓":""}</span>)}</div>
      <div className="pm-draft-pool">{pool.map((p,i)=><button key={p.id||i} className={"pm-draft-part"+(picks[myCat]===p?" selected":"")} onClick={()=>submitPick(p)}><span className="pm-draft-part-name">{p.name.split(" ").slice(0,5).join(" ")}</span><div className="pm-draft-part-meta"><span className="pm-draft-part-price">${p.price}</span>{picks[myCat]===p&&<span style={{color:"var(--c-good)"}}>✓</span>}</div></button>)}</div>
      <div className="pm-synd-chat-wrap" ref={chatRef}>
        <div className="pm-synd-chat">{chat.map((m,i)=><div key={i} className="pm-synd-msg"><b>{m.name}:</b> {m.text}</div>)}</div>
        <div className="pm-synd-chat-row"><input className="rf-input pm-synd-chat-input" value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Team chat…" onKeyDown={e=>e.key==="Enter"&&sendChat()}/><button className="pm-synd-send" onClick={sendChat}><Send size={14}/></button></div>
      </div>
      <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={()=>setPhase("lobby")}><ChevronLeft size={16}/> Back</button>{isHost&&<button className="rf-btn" onClick={()=>setPhase("result")} disabled={Object.keys(picks).length<3}>Submit vs AI ({Object.keys(picks).length}/{CATEGORY_ORDER.length})</button>}{!isHost&&<span className="pm-dim" style={{fontSize:"0.78rem"}}>Host submits when ready</span>}</div>
    </div>
  );}
  if(phase==="result"&&aiOpp){const won=(syndScore?.total||0)>=(aiScore?.total||0);return(
    <div className="pm-card rf-fade">
      <h2 className="pm-h2" style={{textAlign:"center"}}>{won?"🏆 Syndicate Wins!":"💀 AI Wins"}</h2>
      <div className="pm-draft-result">
        <div className={"pm-draft-result-col"+(won?" win":"")}><div className="pm-draft-result-head">SYNDICATE — {syndScore?.total||0}</div>{CATEGORY_ORDER.filter(c=>picks[c]).map(c=><div key={c} className="pm-draft-item you">{CAT_META[c].label}: {picks[c].name}</div>)}</div>
        <div className={"pm-draft-result-col"+(!won?" win":"")}><div className="pm-draft-result-head ai">AI — {aiScore?.total||0}</div>{CATEGORY_ORDER.filter(c=>aiOpp[c]).map(c=><div key={c} className="pm-draft-item ai">{CAT_META[c].label}: {aiOpp[c].name}</div>)}</div>
      </div>
      <button className="rf-btn" onClick={onMenu} style={{display:"block",margin:"16px auto 0"}}>Menu</button>
    </div>
  );}
  return null;
}

/* ---- Feature 6: Adversarial Component Bans ---- */
function BanPhaseScreen({ round, myElo, aiElo, onDone, onBack }) {
  const [myBans, setMyBans] = useState([]);
  const aiBans = useMemo(()=>{
    const out=[];
    for(const cat of CATEGORY_ORDER){
      const top=moggerOptions(cat).sort((a,b)=>ucPerf(cat,b,round.useCase)-ucPerf(cat,a,round.useCase))[0];
      if(top){out.push({...top,cat});}
      if(out.length>=2)break;
    }
    return out;
  },[round.useCase]);
  const banPool = useMemo(()=>{
    const out=[];
    for(const cat of CATEGORY_ORDER)moggerOptions(cat).sort((a,b)=>ucPerf(cat,b,round.useCase)-ucPerf(cat,a,round.useCase)).slice(0,3).forEach(p=>out.push({...p,cat}));
    return out;
  },[round.useCase]);
  const toggleBan=(part)=>{
    const key=part.cat+":"+part.name;
    setMyBans(prev=>{ const has=prev.find(b=>b.cat+":"+b.name===key); if(has)return prev.filter(b=>b.cat+":"+b.name!==key); if(prev.length>=2)return prev; return[...prev,part]; });
  };
  return(
    <div className="pm-card rf-fade">
      <h2 className="pm-h2">🚫 Component Bans</h2>
      <p className="pm-p">Ban 2 of the AI's top components from its pool. The AI also bans 2 of yours.</p>
      <div className="pm-ban-ai"><div className="pm-ban-section-head">🤖 AI bans from your pool:</div>{aiBans.map(p=><div key={p.cat+p.name} className="pm-ban-item ai"><span className="pm-ban-cat">{CAT_META[p.cat]?.label}</span><span className="pm-ban-name">{p.name.split(" ").slice(0,4).join(" ")}</span><span className="pm-ban-badge">BANNED</span></div>)}</div>
      <div className="pm-ban-yours"><div className="pm-ban-section-head">🚫 Ban from AI pool ({myBans.length}/2):</div>
        <div className="pm-ban-pool">{banPool.map(p=>{const key=p.cat+":"+p.name;const banned=!!myBans.find(b=>b.cat+":"+b.name===key);const disabled=!banned&&myBans.length>=2;return(<button key={key} className={"pm-ban-part"+(banned?" banned":"")+(disabled?" dimmed":"")} onClick={()=>toggleBan(p)} disabled={disabled}><span className="pm-ban-cat">{CAT_META[p.cat]?.label}</span><span className="pm-ban-name">{p.name.split(" ").slice(0,4).join(" ")}</span><span className="pm-ban-price">${p.price}</span>{banned&&<span className="pm-ban-badge">✗</span>}</button>);})}</div>
      </div>
      <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={onBack}><ChevronLeft size={16}/> Back</button><button className="rf-btn" onClick={()=>onDone(myBans,aiBans)} disabled={myBans.length<2}>Lock Bans ({myBans.length}/2) <ChevronRight size={16}/></button></div>
    </div>
  );
}

function MoggerGame({ onExit, onSaveBuild }) {
  const [screen, setScreen] = useState(() => { try { const p = window.location.pathname.replace(/\/+$/, "").split("/").pop(); if (p === "admin") return "admin"; if (p === "coadmin") return "coadmin"; } catch (e) {} return "menu"; });
  const [mode, setMode] = useState("ai");
  const [round, setRound] = useState(null);
  const [you, setYou] = useState(null);
  const [opp, setOpp] = useState(null);
  const [user, setUser] = useState(() => { try { const s = localStorage.getItem("mogger_user"); return s ? JSON.parse(s) : null; } catch (e) { return null; } });
  const [showAuth, setShowAuth] = useState(false);
  const [aiElo, setAiElo] = useState(550);
  const [aiHidden, setAiHidden] = useState(false);
  const [practice, setPractice] = useState(false);
  const [rankedAsk, setRankedAsk] = useState(false);
  const [custom, setCustom] = useState(1500);
  const [eloMsg, setEloMsg] = useState(null);
  const [mirrored, setMirrored] = useState(false);
  const eloAppliedRef = useRef(false);
  const [streak, setStreak] = useState(() => { try { return +(localStorage.getItem("mogger_streak") || 0); } catch(e) { return 0; } });
  const [bestStreak, setBestStreak] = useState(() => { try { return +(localStorage.getItem("mogger_best_streak") || 0); } catch(e) { return 0; } });
  const historyAppliedRef = useRef(false);
  const [showMoreModes, setShowMoreModes] = useState(false);
  const [specialRanked, setSpecialRanked] = useState({});
  // Batch 3 state
  const [coinBalance, setCoinBalance] = useState(null);
  const [activeBet, setActiveBet] = useState(null);
  const [bannedMode, setBannedMode] = useState(false);
  const [youBannedParts, setYouBannedParts] = useState([]);
  const [aiBannedParts, setAiBannedParts] = useState([]);
  const [factionWinner, setFactionWinner] = useState(null);
  // Best-of-3 series (vs AI): seriesPick is the pre-match toggle, series tracks an active series
  const [seriesPick, setSeriesPick] = useState(false);
  const [series, setSeries] = useState(null); // { wins:{you,opp}, game, done, winner }
  // A7: Pre-match taunt
  const [selectedTaunt, setSelectedTaunt] = useState(null);
  const [activeRogueReward, setActiveRogueReward] = useState(null); // reward chosen for this match, or null
  // B2: confetti on win
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  // Rivals data
  const rivalsData = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("mogger_rivals") || "{}"); } catch(e) { return {}; }
  }, [screen]);
  const topRival = useMemo(() => {
    const entries = Object.entries(rivalsData).filter(([, v]) => (v.w + v.l) > 0);
    if (!entries.length) return null;
    return entries.sort((a, b) => (b[1].w + b[1].l) - (a[1].w + a[1].l))[0];
  }, [rivalsData]);
  // A3: stats
  const histStats = useMemo(() => {
    try {
      const h = JSON.parse(localStorage.getItem("mogger_history") || "[]");
      const wins = h.filter(x => x.won).length;
      const avg = h.length > 0 ? Math.round(h.reduce((s, x) => s + (x.myScore || 0), 0) / h.length) : 0;
      const best = h.reduce((m, x) => Math.max(m, x.myScore || 0), 0);
      const hardestAI = +(localStorage.getItem("mogger_hardest_ai") || "0");
      return { total: h.length, wins, losses: h.length - wins, avg, best, hardestAI };
    } catch(e) { return { total:0, wins:0, losses:0, avg:0, best:0, hardestAI:0 }; }
  }, [screen]);
  // Daily elo change (sum of all elo deltas today)
  const todayEloChange = useMemo(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const log = JSON.parse(localStorage.getItem("mogger_elo_log") || "[]");
      return log.filter((e) => e.date === today).reduce((s, e) => s + e.delta, 0);
    } catch(e) { return 0; }
  }, [screen]);
  // B3: daily challenge seed
  const dailyChallenge = useMemo(() => {
    const d = new Date(); const seed = d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
    const ucs = MOGGER_UCS; const buds = MOGGER_BUDGETS;
    return { useCase: ucs[seed % ucs.length], budget: buds[seed % buds.length], secs: 120 + (seed % 4) * 60, isDaily: true };
  }, []);
  const dailyGauntletInfo = useMemo(() => dailyGauntlet(), []);
  // Daily Challenge streak — consecutive days played (Wordle-style)
  const dailyStreakInfo = useMemo(() => {
    try {
      const log = JSON.parse(localStorage.getItem("mogger_daily_log") || "[]");
      const set = new Set(log);
      const today = new Date(); const todayKey = today.toISOString().slice(0, 10);
      const playedToday = set.has(todayKey);
      let streakCount = 0;
      const cursor = new Date(today);
      if (!playedToday) cursor.setDate(cursor.getDate() - 1);
      while (set.has(cursor.toISOString().slice(0, 10))) { streakCount++; cursor.setDate(cursor.getDate() - 1); }
      return { streak: streakCount, playedToday };
    } catch (e) { return { streak: 0, playedToday: false }; }
  }, [screen]);

  const persist = (u) => { setUser(u); try { if (u) localStorage.setItem("mogger_user", JSON.stringify(u)); else localStorage.removeItem("mogger_user"); } catch (e) {} };
  const refreshMe = useCallback(() => {
    const u = (() => { try { const s = localStorage.getItem("mogger_user"); return s ? JSON.parse(s) : null; } catch (e) { return null; } })();
    if (!u || !u.id) return;
    netFetchUser(u.id).then((srv) => { if (srv && (srv.elo !== u.elo || (srv.crank || null) !== (u.crank || null) || srv.name !== u.name)) persist({ id: srv.id, name: srv.name, elo: srv.elo, crank: srv.crank || null }); });
  }, []);
  useEffect(() => { refreshMe(); }, [refreshMe]);
  useEffect(() => { if (screen === "menu") refreshMe(); }, [screen, refreshMe]);

  // Sync all profile data to/from Supabase account
  const syncProfile = useCallback((uid) => {
    if (!uid) return;
    try {
      const profile = {
        history:     JSON.parse(localStorage.getItem("mogger_history") || "[]"),
        streak:      +(localStorage.getItem("mogger_streak") || 0),
        bestStreak:  +(localStorage.getItem("mogger_best_streak") || 0),
        bestScore:   +(localStorage.getItem("mogger_best_score") || 0),
        hardestAI:   +(localStorage.getItem("mogger_hardest_ai") || 0),
        rivals:      JSON.parse(localStorage.getItem("mogger_rivals") || "{}"),
        dailyLog:    JSON.parse(localStorage.getItem("mogger_daily_log") || "[]"),
        ghosts:      JSON.parse(localStorage.getItem("mogger_ghosts") || "[]"),
        rogueRewards:JSON.parse(localStorage.getItem("mogger_rogue_rewards") || "null"),
      };
      netSaveProfile(uid, profile);
    } catch(e) {}
  }, []);

  // On login: pull profile from server and hydrate localStorage + state
  useEffect(() => {
    if (!user?.id) return;
    netFetchProfile(user.id).then(profile => {
      if (!profile || !Object.keys(profile).length) return;
      try {
        if (profile.history?.length) {
          const local = JSON.parse(localStorage.getItem("mogger_history") || "[]");
          if (profile.history.length >= local.length) localStorage.setItem("mogger_history", JSON.stringify(profile.history));
        }
        if (profile.streak != null) { localStorage.setItem("mogger_streak", profile.streak); setStreak(profile.streak); }
        if (profile.bestStreak != null) { localStorage.setItem("mogger_best_streak", profile.bestStreak); setBestStreak(profile.bestStreak); }
        if (profile.bestScore) localStorage.setItem("mogger_best_score", profile.bestScore);
        if (profile.hardestAI) localStorage.setItem("mogger_hardest_ai", profile.hardestAI);
        if (profile.rivals) localStorage.setItem("mogger_rivals", JSON.stringify(profile.rivals));
        if (profile.dailyLog?.length) localStorage.setItem("mogger_daily_log", JSON.stringify(profile.dailyLog));
        if (profile.ghosts?.length) {
          const local = JSON.parse(localStorage.getItem("mogger_ghosts") || "[]");
          if (profile.ghosts.length >= local.length) localStorage.setItem("mogger_ghosts", JSON.stringify(profile.ghosts));
        }
        if (profile.rogueRewards) localStorage.setItem("mogger_rogue_rewards", JSON.stringify(profile.rogueRewards));
      } catch(e) {}
    });
  }, [user?.id]);
  useEffect(() => {
    if (!user?.id) return;
    netFetchBalance(user.id).then(b => { if (b != null) setCoinBalance(b); });
    // Check if last week's faction war has a winner to display as banner
    try {
      const { weekKey } = currentFactionWar();
      netSupabase.rpc("apply_faction_week_reward", { p_week_key: weekKey }).then(({ data }) => {
        if (data && data[0]?.winner) {
          const { war } = currentFactionWar();
          const w = data[0].winner;
          setFactionWinner({ faction: w, label: war ? (w === "a" ? war.teamA : war.teamB) : w });
        }
      });
    } catch(e) {}
  }, [user?.id]);

  // Meta Shift Alerts — diff the catalog's top picks against last session's snapshot once on load
  const [metaShifts, setMetaShifts] = useState([]);
  useEffect(() => {
    try {
      const current = catalogTopPicks();
      const prevRaw = localStorage.getItem("mogger_meta_snapshot");
      if (prevRaw) {
        const prev = JSON.parse(prevRaw);
        const shifts = [];
        for (const c of CATEGORY_ORDER) {
          const p = prev[c], n = current[c];
          if (!p || !n) continue;
          if (p.bestPerfId !== n.bestPerfId) shifts.push({ cat: c, type: "performance", from: p.bestPerfName, to: n.bestPerfName });
          if (p.bestValueId !== n.bestValueId) shifts.push({ cat: c, type: "value", from: p.bestValueName, to: n.bestValueName });
        }
        if (shifts.length) setMetaShifts(shifts);
      }
      localStorage.setItem("mogger_meta_snapshot", JSON.stringify(current));
    } catch (e) {}
  }, []);

  const chooseDiff = (d) => {
    if (d.k === "custom") { setAiElo(custom); setAiHidden(false); }
    else if (d.k === "random") { setAiElo(100 + Math.floor(Math.random() * 2900)); setAiHidden(true); }
    else { setAiElo(d.elo); setAiHidden(false); }
    setScreen(bannedMode ? "ban-phase" : "taunt-pick");
  };
  const start = (r) => {
    setRound(r); eloAppliedRef.current = false; historyAppliedRef.current = false; setEloMsg(null);
    if (mode === "ai") {
      let aiB = moggerAI(r.useCase, r.budget, aiElo);
      if (bannedMode && aiBannedParts.length > 0) {
        for (const ban of aiBannedParts) {
          if (aiB[ban.cat]?.name === ban.name) {
            const fallback = moggerOptions(ban.cat).find(p => p.name !== ban.name);
            if (fallback) aiB = { ...aiB, [ban.cat]: fallback };
          }
        }
      }
      setOpp(aiB);
    }
    if (seriesPick && mode === "ai") { setSeries({ wins: { you: 0, opp: 0 }, game: 1, done: false, winner: null }); setSeriesPick(false); }
    else setSeries(null);
    setScreen("intro");
  };
  const finishP1 = (b) => { setYou(b); if (mode === "ai" || mode === "ghost") setScreen("result"); else if (mode === "gauntlet") setScreen("gauntlet-result"); else setScreen("handoff"); };
  const finishP2 = (b) => { setOpp(b); setScreen("result"); };
  const again = () => { setYou(null); setOpp(null); setEloMsg(null); setMirrored(false); eloAppliedRef.current = false; setSeries(null); setScreen(mode === "ai" ? "diff" : mode === "ghost" ? "ghosts" : "lobby"); };
  // Ghost Duel Replay — challenge a recorded build; the opponent column replays its real
  // parts move-by-move instead of generating a fresh AI build.
  const [activeGhost, setActiveGhost] = useState(null);
  const challengeGhost = (ghost) => {
    setMode("ghost"); setActiveGhost(ghost);
    setRound({ useCase: ghost.useCase, budget: ghost.budget, secs: ghost.secs || 90 });
    setYou(null); setOpp(ghost.build);
    setEloMsg(null); setMirrored(false); eloAppliedRef.current = false; historyAppliedRef.current = false; setSeries(null);
    setScreen("intro");
  };
  const rematchGhost = () => { if (activeGhost) challengeGhost(activeGhost); };
  // Rematch — exact same use case / budget / opponent elo, skip difficulty re-pick
  const rematch = () => {
    setYou(null); setOpp(null); setEloMsg(null); setMirrored(false);
    eloAppliedRef.current = false; historyAppliedRef.current = false;
    if (mode === "ai") setOpp(moggerAI(round.useCase, round.budget, aiElo));
    setScreen("intro");
  };
  // Best-of-3: advance to the next game in the active series — same use case/budget/opponent
  const nextSeriesGame = () => {
    setYou(null); setOpp(null); setEloMsg(null); setMirrored(false);
    eloAppliedRef.current = false; historyAppliedRef.current = false;
    setSeries((s) => (s ? { ...s, game: s.game + 1 } : s));
    if (mode === "ai") setOpp(moggerAI(round.useCase, round.budget, aiElo));
    setScreen("intro");
  };
  const menu = () => { setYou(null); setOpp(null); setRound(null); setEloMsg(null); setMirrored(false); setSeries(null); setSeriesPick(false); setActiveGhost(null); setActiveBet(null); setBannedMode(false); setYouBannedParts([]); setAiBannedParts([]); setScreen("menu"); };
  // Avenge the Rival — fresh challenge, opponent re-rolled within the same rival elo tier
  const avengeRival = (tierName) => {
    const newAiElo = eloTierRandom(tierName);
    setAiElo(newAiElo); setAiHidden(false);
    const r = { useCase: mRand(MOGGER_UCS), budget: mRand(MOGGER_BUDGETS), secs: 50 + Math.floor(Math.random() * 370) };
    setRound(r); setYou(null); setOpp(moggerAI(r.useCase, r.budget, newAiElo));
    setEloMsg(null); setMirrored(false); eloAppliedRef.current = false; historyAppliedRef.current = false;
    setSeries(null);
    setScreen("intro");
  };
  const exitToRoot = () => {
    try { if (typeof window !== "undefined" && window.history) { const p = window.location.pathname.replace(/\/+$/, "").split("/").pop(); if (p === "admin" || p === "coadmin") window.history.replaceState(null, "", "/"); } } catch (e) {}
    onExit();
  };

  // save duel history + update streak after any result (ghost duels are practice replays — skip)
  useEffect(() => {
    if (screen !== "result" || !you || !opp || historyAppliedRef.current || mode === "ghost") return;
    historyAppliedRef.current = true;
    const sy = moggerScore(you, round.useCase, round.budget).total;
    const so = moggerScore(opp, round.useCase, round.budget).total;
    const won = sy >= so;
    const oName = mode === "ai" ? aiPersona(aiElo).name : "Player 2";
    const entry = { won, myScore: sy, oppScore: so, oppName: oName, useCase: round.useCase, budget: round.budget, date: new Date().toLocaleDateString() };
    entry.you = JSON.parse(JSON.stringify(you || {}));
    entry.opp = JSON.parse(JSON.stringify(opp || {}));
    try {
      const hist = JSON.parse(localStorage.getItem("mogger_history") || "[]");
      hist.push(entry);
      if (hist.length > 10) hist.splice(0, hist.length - 10);
      localStorage.setItem("mogger_history", JSON.stringify(hist));
    } catch(e) {}
    // Ghost Duel Replay: bank both builds from this match so they can be challenged later
    try {
      const ghosts = JSON.parse(localStorage.getItem("mogger_ghosts") || "[]");
      const dateStr = new Date().toLocaleDateString();
      ghosts.push({ id: "g" + Date.now() + "y", date: dateStr, useCase: round.useCase, budget: round.budget, secs: round.secs, build: entry.you, score: sy, label: "You — " + dateStr });
      ghosts.push({ id: "g" + Date.now() + "o", date: dateStr, useCase: round.useCase, budget: round.budget, secs: round.secs, build: entry.opp, score: so, label: oName + " — " + dateStr });
      if (ghosts.length > 30) ghosts.splice(0, ghosts.length - 30);
      localStorage.setItem("mogger_ghosts", JSON.stringify(ghosts));
    } catch (e) {}
    // Rival tracker
    if (mode === "ai") {
      try {
        const eloTier = eloTierName(aiElo);
        const rivals = JSON.parse(localStorage.getItem("mogger_rivals") || "{}");
        if (!rivals[eloTier]) rivals[eloTier] = { w: 0, l: 0 };
        if (won) rivals[eloTier].w += 1; else rivals[eloTier].l += 1;
        localStorage.setItem("mogger_rivals", JSON.stringify(rivals));
      } catch(e) {}
    }
    // Best-of-3 series: tally this game's result, declare a series winner at 2 wins
    if (series && !series.done) {
      setSeries((s) => {
        if (!s || s.done) return s;
        const key = won ? "you" : "opp";
        const wins = { ...s.wins, [key]: s.wins[key] + 1 };
        const done = wins.you >= 2 || wins.opp >= 2;
        return { ...s, wins, done, winner: done ? (wins.you >= 2 ? "you" : "opp") : null };
      });
    }
    // A4: Track best score + hardest AI
    const prevBest = +(localStorage.getItem("mogger_best_score") || "0");
    if (sy > prevBest) localStorage.setItem("mogger_best_score", String(sy));
    if (won && mode === "ai") {
      const prevH = +(localStorage.getItem("mogger_hardest_ai") || "0");
      if (aiElo > prevH) localStorage.setItem("mogger_hardest_ai", String(aiElo));
    }
    const newStreak = won ? streak + 1 : 0;
    const newBest = Math.max(bestStreak, newStreak);
    setStreak(newStreak);
    setBestStreak(newBest);
    if (won) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 4500); }
    try { localStorage.setItem("mogger_streak", newStreak); localStorage.setItem("mogger_best_streak", newBest); } catch(e) {}
    // Daily Challenge streak — log today's date once
    if (round.isDaily) {
      try {
        const log = JSON.parse(localStorage.getItem("mogger_daily_log") || "[]");
        const todayKey = new Date().toISOString().slice(0, 10);
        if (!log.includes(todayKey)) { log.push(todayKey); if (log.length > 365) log.splice(0, log.length - 365); localStorage.setItem("mogger_daily_log", JSON.stringify(log)); }
      } catch (e) {}
    }
    syncProfile(user?.id);
  }, [screen]);

  // apply elo after a vs-AI result
  useEffect(() => {
    if (screen !== "result" || mode !== "ai" || practice || !user || !you || !opp || eloAppliedRef.current) return;
    eloAppliedRef.current = true;
    const sy = moggerScore(you, round.useCase, round.budget).total;
    const so = moggerScore(opp, round.useCase, round.budget).total;
    // Win-streak ELO bonus: every 3 consecutive wins adds +10% to the gain, capped at +50%.
    const newStreak = sy >= so ? streak + 1 : 0;
    const streakLevel = Math.floor(newStreak / 3);
    const streakMult = sy > so ? Math.min(1 + streakLevel * 0.10, 1.5) : 1;
    let delta = 0;
    if (sy > so) delta = Math.round(netEloGain(user.elo, aiElo) * streakMult);
    else if (sy < so) delta = -netEloGain(aiElo, user.elo);
    const newElo = Math.max(0, user.elo + delta);
    persist({ ...user, elo: newElo });
    netSaveElo(user.id, newElo);
    setEloMsg({ delta, newElo, streak: newStreak, streakMult });
    // Faction Wars: a ranked win earns points for your picked faction this week
    // (+5 bonus if your build's relevant hardware actually matches your pick).
    try {
      if (sy > so) {
        const { war, weekKey } = currentFactionWar();
        const pick = JSON.parse(localStorage.getItem("mogger_faction_pick") || "null");
        if (pick && pick.weekKey === weekKey && pick.warId === war.id) {
          const pts = 10 + (buildFactionMatch(you, war.id, round.budget) === pick.faction ? 5 : 0);
          const localKey = "mogger_faction_local_" + weekKey + "_" + war.id;
          const local = JSON.parse(localStorage.getItem(localKey) || '{"a":0,"b":0}');
          local[pick.faction] = (local[pick.faction] || 0) + pts;
          localStorage.setItem(localKey, JSON.stringify(local));
          netRecordFactionPoints(user.id, weekKey, war.id, pick.faction, pts);
        }
      }
    } catch (e) {}
    // Track daily elo changes
    try {
      const today = new Date().toISOString().slice(0, 10);
      const log = JSON.parse(localStorage.getItem("mogger_elo_log") || "[]");
      log.push({ date: today, delta, newElo });
      if (log.length > 200) log.splice(0, log.length - 200);
      localStorage.setItem("mogger_elo_log", JSON.stringify(log));
    } catch(e) {}
    // Decrement only the reward the player chose to use this match
    if (activeRogueReward) {
      try {
        const storedR = JSON.parse(localStorage.getItem("mogger_rogue_rewards")||"null");
        if (storedR?.list?.length > 0) {
          const updated = storedR.list.map(r =>
            r.id === activeRogueReward.id ? {...r, matchesLeft: r.matchesLeft - 1} : r
          ).filter(r => r.matchesLeft > 0);
          localStorage.setItem("mogger_rogue_rewards", JSON.stringify({...storedR, list: updated}));
        }
      } catch(e) {}
      setActiveRogueReward(null);
    }
    // Settle bet if one is active
    if (activeBet && user?.id) {
      const won = sy >= so ? activeBet.side === "you" : activeBet.side === "ai";
      netSettleBet(activeBet.id, won).then(payout => {
        if (payout != null) {
          setCoinBalance(prev => (prev||0) + (won ? Math.round(activeBet.stake * activeBet.odds) : 0));
          netFetchBalance(user.id).then(b => { if (b != null) setCoinBalance(b); });
        }
      });
      setActiveBet(null);
    }
    syncProfile(user?.id);
  }, [screen]);

  return (
    <div className="pm-mogger rf-fade">
      {showConfetti && <Confetti />}
      {feedbackOpen && <FeedbackModal user={user} onClose={() => setFeedbackOpen(false)} />}
      {screen === "menu" && (
        <div className="pm-menu">
          {/* Header */}
          <div className="pm-menu-header">
            <div className="pm-mtitle">PC <span className="rf-accent">DUELS</span></div>
            <div className="pm-account">{user ? <><RankBadges elo={user.elo} custom={user.crank} /><span className="pm-acct-elo">{user.elo} elo</span>{todayEloChange !== 0 && <span className={"pm-daily-elo-inline " + (todayEloChange > 0 ? "up" : "down")}>{todayEloChange > 0 ? "+" : ""}{todayEloChange} this session</span>}{coinBalance != null && <span className="pm-coin-balance">🪙 {coinBalance}</span>}<button className="pm-acct-btn" onClick={() => persist(null)}>{user.name} ✕</button></> : <button className="pm-acct-btn" onClick={() => setShowAuth(true)}>Log in</button>}</div>
          </div>

          {/* Alerts */}
          {metaShifts.length > 0 && <div className="pm-meta-banner"><div className="pm-meta-banner-head"><span>📊 Meta Shift</span><button className="pm-meta-dismiss" onClick={() => setMetaShifts([])}><X size={13} /></button></div>{metaShifts.slice(0,2).map((s,i) => <div key={i} className="pm-meta-shift-row"><b>{CAT_META[s.cat].label}</b> {s.type==="value"?"best value":"top pick"} → <b className="pm-meta-new">{s.to}</b></div>)}</div>}
          {factionWinner && <div className="pm-faction-winner-banner">🏆 Faction winner: <b>{factionWinner.label||factionWinner.faction}</b></div>}

          {/* Stats bar */}
          {histStats.total > 0 && (
            <div className="pm-stats-bar">
              <span className="pm-stat-w">W <b>{histStats.wins}</b></span>
              <span className="pm-stat-l">L <b>{histStats.losses}</b></span>
              <span>Avg <b>{histStats.avg}</b></span>
              <span>Best <b>{histStats.best}</b></span>
              {streak > 0 && <span>🔥 <b>{streak}</b>{streak >= 3 && <span className="pm-streak-mult-badge"> +{Math.round((Math.min(1+Math.floor(streak/3)*0.10,1.5)-1)*100)}%</span>}</span>}
              {(() => { try { const h=JSON.parse(localStorage.getItem("mogger_history")||"[]").slice(-8); if(h.length<3)return null; return <span className="pm-spark-inline">{h.map((e,i)=><span key={i} className={"pm-spark-dot "+(e.won?"win":"lose")}/>)}</span>; } catch(e){return null;} })()}
            </div>
          )}

          {/* 4 hero buttons */}
          <div className="pm-hero-4">
            <button className="pm-mode pm-mode-hero" onClick={() => { setMode("ai"); setScreen("diff"); }}>
              <span className="pm-mode-icon"><Bot size={24}/></span>
              <span className="pm-mode-name">Play AI</span>
              <span className="pm-mode-sub">Ranked or practice</span>
            </button>
            <button className="pm-mode pm-mode-hero" onClick={() => setScreen("online")}>
              <span className="pm-mode-icon">🌐</span>
              <span className="pm-mode-name">Online Multiplayer</span>
              <span className="pm-mode-sub">Real opponents worldwide</span>
            </button>
            <button className="pm-mode pm-mode-hero" onClick={() => setScreen("special-modes")}>
              <span className="pm-mode-icon">🎮</span>
              <span className="pm-mode-name">Special Game Modes</span>
              <span className="pm-mode-sub">Speed · Draft · Rogue · more</span>
            </button>
            <button className="pm-mode pm-mode-hero" onClick={() => setScreen("leaderboard")}>
              <span className="pm-mode-icon">🏆</span>
              <span className="pm-mode-name">Leaderboard</span>
              <span className="pm-mode-sub">Top ranked players</span>
            </button>
          </div>

          {/* Browse */}
          <div className="pm-quick-row pm-browse-row">
            <button className="pm-quick-btn" onClick={() => setScreen("history")}>📜 History</button>
            <button className="pm-quick-btn" onClick={() => setScreen("factions")}>⚔️ Factions</button>
            <button className="pm-quick-btn" onClick={() => setScreen("ghosts")}>👻 Ghosts</button>
            <button className="pm-quick-btn" onClick={() => setScreen("archaeology")}>🏛️ Arch</button>
            <button className="pm-quick-btn" onClick={() => setScreen("achievements")}>🏅 Badges</button>
            {user && coinBalance != null && <button className="pm-quick-btn pm-coin-wallet-btn" onClick={() => setScreen("wallet")}>🪙 Wallet</button>}
            <button className="pm-quick-btn" onClick={() => setFeedbackOpen(true)}>📩</button>
          </div>

          <button className="rf-ghost pm-exit" onClick={onExit}><ChevronLeft size={15}/> Back to builder</button>
        </div>
      )}
      {showAuth && <MoggerAuth onClose={() => setShowAuth(false)} onAuth={(u) => { persist(u); setShowAuth(false); }} />}
      {screen === "diff" && (
        <div className="pm-card pm-lobby-wide pm-center rf-fade">
          <h2 className="pm-h2"><Bot size={20} /> Choose AI difficulty</h2>
          <div className="pm-seg">
            <button className={(!practice && user ? "on" : "") + (!user ? " pm-seg-disabled" : "")} onClick={() => { if (!user) { setRankedAsk(true); } else { setPractice(false); setRankedAsk(false); } }}>Ranked</button>
            <button className={(practice || !user) ? "on" : ""} onClick={() => { setPractice(true); setRankedAsk(false); }}>Practice</button>
          </div>
          {!user ? (
            rankedAsk ? (
              <div className="pm-seg-note pm-ranked-prompt">
                <span>To play ranked you have to log in / sign up.</span>
                <button className="rf-btn" onClick={() => setShowAuth(true)}>Log in / Sign up</button>
              </div>
            ) : (
              <p className="pm-seg-note">Practice — your elo never changes. Log in to play Ranked.</p>
            )
          ) : (
            <p className="pm-seg-note">{practice ? "Practice — your elo never changes, win or lose." : "Ranked — win to gain elo, lose to drop it."}</p>
          )}
          <label className="pm-toggle pm-series-toggle"><input type="checkbox" checked={seriesPick} onChange={(e) => setSeriesPick(e.target.checked)} /><span>🏆 Best-of-3 series — same challenge, same opponent, first to 2 wins</span></label>
          <div className="pm-diff-grid">
            {DIFFS.map((d) => {
              const oppElo = d.k === "custom" ? custom : d.elo;
              const winPct = (user && d.k !== "random") ? Math.round(100 / (1 + Math.pow(10, (oppElo - user.elo) / 400))) : null;
              return (
                <button key={d.k} className="pm-diff" onClick={() => chooseDiff(d)}>
                  <span className="pm-diff-name">{d.label}</span>
                  <span className="pm-diff-elo">{d.k === "random" ? "? elo" : d.k === "custom" ? custom + " elo" : d.elo + " elo"}</span>
                  {winPct != null && <span className={"pm-diff-winpct" + (winPct >= 50 ? " fav" : " under")}>{winPct}% win chance</span>}
                </button>
              );
            })}
            <button className="pm-mode" onClick={() => { const d = DIFFS[Math.floor(Math.random() * (DIFFS.length - 1))]; chooseDiff(d); }}><span className="pm-mode-icon">🎲</span><span className="pm-mode-name">Surprise Me</span><span className="pm-mode-sub">Random difficulty, let fate decide</span></button>
          </div>
          <div className="pm-field"><span className="pm-field-l">Custom elo: {custom}{user && <span className="pm-diff-winpct-inline"> · {Math.round(100 / (1 + Math.pow(10, (custom - user.elo) / 400)))}% win chance</span>}</span><input type="range" min="100" max="3000" step="50" value={custom} onChange={(e) => setCustom(+e.target.value)} className="pm-range" /></div>
          <label className="pm-toggle pm-ban-toggle"><input type="checkbox" checked={bannedMode} onChange={(e) => setBannedMode(e.target.checked)} /><span>🚫 Adversarial Bans — ban 2 AI components before the duel</span></label>
          {user && coinBalance != null && <BettingPanel myElo={user.elo} oppElo={aiElo} balance={coinBalance} activeBet={activeBet} onBet={async(bet) => { if (!user?.id) return; const row = await netPlaceBet(user.id, bet.side, bet.stake, bet.odds); if (row) { setActiveBet({...bet, id: row.id}); setCoinBalance(prev => (prev||0) - bet.stake); } }} />}
          <button className="rf-btn rf-ghost-btn" onClick={menu}><ChevronLeft size={16} /> Back</button>
        </div>
      )}
      {screen === "special-modes" && (() => {
        const SPECIAL_MODES = [
          { id: "speed",     icon: "⚡", name: "Speed Duel",          desc: "60 seconds to build — fastest fingers win",            ranked: "both"     },
          { id: "daily",     icon: "📅", name: "Daily Challenge",      desc: "Same puzzle for every player today",                   ranked: "ranked"   },
          { id: "bo3",       icon: "🏆", name: "Best-of-3 Series",    desc: "Same AI, same budget — first to 2 wins",               ranked: "both"     },
          { id: "gauntlet",  icon: "🎯", name: "Constraint Gauntlet", desc: "Build under random restrictions per category",         ranked: "both"     },
          { id: "draft",     icon: "🃏", name: "Draft Mode",           desc: "Alternate picks with the AI — block their best parts", ranked: "both"     },
          { id: "banphase",  icon: "🚫", name: "Ban Phase Duel",       desc: "Ban 2 opponent parts before the build starts",         ranked: "both"     },
          { id: "rogue",     icon: "⚔️", name: "Rogue Run",            desc: "Monthly gauntlet — earn temporary ranked boosts",      ranked: "unranked" },
          { id: "ghost",     icon: "👻", name: "Ghost Duel",           desc: "Challenge a recorded build from your history",         ranked: "unranked" },
          { id: "pp",        icon: "🎮", name: "Pass & Play",          desc: "Two players, one screen — local showdown",             ranked: "unranked" },
          { id: "syndicate", icon: "🤝", name: "Syndicate",            desc: "Collaborative community build challenge",              ranked: "unranked" },
        ];
        const launch = (id) => {
          const isPrac = !(specialRanked[id] ?? true);
          setPractice(isPrac);
          if (id === "speed")     { setMode("ai"); start({ useCase: mRand(MOGGER_UCS), budget: mRand(MOGGER_BUDGETS), secs: 60 }); }
          else if (id === "daily"){ setMode("ai"); setPractice(false); start(dailyChallenge); }
          else if (id === "bo3")  { setMode("ai"); setSeriesPick(true); setScreen("diff"); }
          else if (id === "gauntlet") { setMode("gauntlet"); start(dailyGauntletInfo); }
          else if (id === "draft")    { setScreen("draft"); }
          else if (id === "banphase") { setMode("ai"); setBannedMode(true); setScreen("diff"); }
          else if (id === "rogue")    { setScreen("rogue"); }
          else if (id === "ghost")    { setScreen("ghosts"); }
          else if (id === "pp")       { setMode("local"); setScreen("lobby"); }
          else if (id === "syndicate"){ setScreen("syndicate"); }
        };
        return (
          <div className="pm-card rf-fade pm-special-modes-screen">
            <div className="pm-special-modes-head">
              <button className="pm-back-inline" onClick={menu}><ChevronLeft size={15}/></button>
              <h2 className="pm-h2">🎮 Special Game Modes</h2>
            </div>
            <div className="pm-special-modes-list">
              {SPECIAL_MODES.map(m => {
                const isRanked = specialRanked[m.id] ?? true;
                return (
                  <div key={m.id} className="pm-special-mode-card">
                    <span className="pm-special-mode-icon">{m.icon}</span>
                    <div className="pm-special-mode-info">
                      <span className="pm-special-mode-name">{m.name}</span>
                      <span className="pm-special-mode-desc">{m.desc}</span>
                    </div>
                    <div className="pm-special-mode-right">
                      {m.ranked === "both" && user && (
                        <div className="pm-special-ranked-tog">
                          <button className={"pm-srt-btn"+(isRanked?" on":"")} onClick={() => setSpecialRanked(p=>({...p,[m.id]:true}))}>Ranked</button>
                          <button className={"pm-srt-btn"+(!isRanked?" on":"")} onClick={() => setSpecialRanked(p=>({...p,[m.id]:false}))}>Unranked</button>
                        </div>
                      )}
                      {m.ranked === "ranked" && <span className="pm-ranked-badge">Ranked</span>}
                      {m.ranked === "unranked" && <span className="pm-unranked-badge">Unranked</span>}
                      <button className="rf-btn pm-special-play-btn" onClick={() => launch(m.id)}>Play</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
      {screen === "wallet" && (
        <div className="pm-card pm-center rf-fade">
          <h2 className="pm-h2">🪙 Wallet</h2>
          {user && coinBalance != null ? (
            <>
              <p className="pm-p">Balance: <b className="pm-coin-big">{coinBalance} coins</b></p>
              {coinBalance >= 5 ? (
                <CoinEloConverter balance={coinBalance} userElo={user.elo} onConvert={async(coins) => {
                  const gain = Math.floor(coins/5);
                  const newElo = user.elo + gain;
                  const newBal = coinBalance - coins;
                  persist({...user, elo: newElo});
                  setCoinBalance(newBal);
                  await netSaveElo(user.id, newElo);
                  await netSupabase.from("mogger_currency").update({balance: newBal}).eq("user_id", user.id);
                }} />
              ) : (
                <p className="pm-dim pm-p">Need at least 5 coins to convert. Win ranked AI matches to earn coins.</p>
              )}
            </>
          ) : (
            <p className="pm-dim pm-p">{user ? "Loading wallet…" : "Log in to access your wallet."}</p>
          )}
          <button className="rf-btn rf-ghost-btn" onClick={menu}><ChevronLeft size={16}/> Back</button>
        </div>
      )}
      {screen === "admin" && <MoggerAdmin onBack={exitToRoot} user={user} />}
      {screen === "coadmin" && <MoggerCoAdmin onBack={exitToRoot} />}
      {screen === "leaderboard" && <MoggerLeaderboard onBack={menu} meName={user ? user.name : null} />}
      {screen === "history" && <MoggerHistory onBack={menu} />}
      {screen === "achievements" && <MoggerAchievements onBack={menu} />}
      {screen === "ghosts" && <MoggerGhosts onBack={menu} onChallenge={challengeGhost} />}
      {screen === "factions" && <MoggerFactions onBack={menu} user={user} onUserUpdate={persist} />}
      {/* A7: Taunt picker + rogue reward selector */}
      {screen === "taunt-pick" && (() => {
        const storedR = (() => { try { return JSON.parse(localStorage.getItem("mogger_rogue_rewards")||"null"); } catch(e){return null;} })();
        const availableRewards = storedR?.list?.filter(r => r.matchesLeft > 0) || [];
        return (
          <div className="pm-card pm-center rf-fade">
            {availableRewards.length > 0 && (
              <div className="pm-rogue-reward-picker">
                <div className="pm-rrp-head">⚔️ Rogue Reward — activate for this match?</div>
                <div className="pm-rrp-list">
                  <button
                    className={"pm-rrp-btn pm-rrp-none" + (activeRogueReward === null ? " on" : "")}
                    onClick={() => setActiveRogueReward(null)}
                  >
                    None
                  </button>
                  {availableRewards.map(r => (
                    <button
                      key={r.id}
                      className={"pm-rrp-btn" + (activeRogueReward?.id === r.id ? " on" : "")}
                      onClick={() => setActiveRogueReward(activeRogueReward?.id === r.id ? null : r)}
                    >
                      <span className="pm-rrp-label">{r.label}</span>
                      <span className="pm-rrp-desc">{r.desc}</span>
                      <span className="pm-rrp-left">{r.matchesLeft} match{r.matchesLeft !== 1 ? "es" : ""} left</span>
                    </button>
                  ))}
                </div>
                {activeRogueReward && <div className="pm-rrp-active-note">✅ <b>{activeRogueReward.label}</b> will be used this match</div>}
              </div>
            )}
            <h2 className="pm-h2">🗣️ Pick your pre-match taunt</h2>
            <p className="pm-p pm-dim">Choose a line to send to your opponent (or skip)</p>
            <div className="pm-taunt-grid">
              {PRETAUNTS.map((t, i) => (
                <button key={i} className={"pm-taunt-btn" + (selectedTaunt === t ? " on" : "")} onClick={() => setSelectedTaunt(t === selectedTaunt ? null : t)}>{t}</button>
              ))}
            </div>
            <div className="pm-row pm-center-row">
              <button className="rf-btn rf-ghost-btn" onClick={() => setScreen("diff")}><ChevronLeft size={16} /> Back</button>
              <button className="rf-btn" onClick={() => setScreen("lobby")}>{selectedTaunt ? "Taunt sent! → Lobby" : "Skip → Lobby"} <ChevronRight size={16} /></button>
            </div>
          </div>
        );
      })()}
      {screen === "online" && (user ? <MoggerOnline onExit={menu} user={user} setUser={persist} onNeedAuth={() => setShowAuth(true)} onSaveBuild={onSaveBuild} /> : (
        <div className="pm-card pm-center rf-fade">
          <h2 className="pm-h2">🌐 Online Multiplayer</h2>
          <p className="pm-p">Playing with real people needs an account (so elo and names work). It's quick and free.</p>
          <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={menu}><ChevronLeft size={16} /> Back</button><button className="rf-btn" onClick={() => setShowAuth(true)}>Log in / Sign up</button></div>
        </div>
      ))}
      {screen === "lobby" && <MoggerLobby mode={mode} onStart={start} onBack={menu} />}
      {screen === "intro" && round && <MoggerIntro round={round} player={mode === "local" ? "Player 1" : null} onGo={() => setScreen("p1")} />}
      {screen === "p1" && round && <MoggerBuild round={round} player={mode === "local" ? "Player 1" : "You"} oppLabel={mode === "ai" ? "AI Opponent" : mode === "ghost" ? ("👻 " + (activeGhost ? activeGhost.label : "Ghost")) : "Player 2"} oppBuild={(mode === "ai" || mode === "ghost") ? opp : null} oppIsAI={mode === "ai"} ghostMode={mode === "ghost"} solo={mode === "gauntlet"} constraint={mode === "gauntlet" ? round.constraint : undefined} oppLocked={false} myElo={mode === "ai" && user ? user.elo : null} oppElo={mode === "ai" ? aiElo : null} bannedParts={mode === "ai" && bannedMode ? youBannedParts : null} onDone={finishP1} />}
      {screen === "gauntlet-result" && round && you && <MoggerGauntletResult round={round} build={you} user={user} onMenu={menu} onPlayAgain={() => { setYou(null); setScreen("intro"); }} />}
      {screen === "handoff" && <div className="pm-card pm-center rf-fade"><h2 className="pm-h2"><Repeat2 size={20} /> Pass the device</h2><p className="pm-p">Player 1 is locked in. Hand the device to <b>Player 2</b> — same challenge, same clock. No peeking.</p><button className="rf-btn" onClick={() => setScreen("intro2")}>I am Player 2 — start <ChevronRight size={16} /></button></div>}
      {screen === "intro2" && round && <MoggerIntro round={round} player="Player 2" onGo={() => setScreen("p2")} />}
      {screen === "p2" && round && <MoggerBuild round={round} player="Player 2" oppLabel="Player 1" oppBuild={you} oppIsAI={false} oppLocked={true} onDone={finishP2} />}
      {screen === "result" && round && you && opp && (() => {
        const aiName = mode === "ai" ? aiPersona(aiElo).name : mode === "ghost" ? (activeGhost ? activeGhost.label : "Ghost") : "Player 2";
        const resultYouLabel = mirrored ? aiName : "You";
        const resultOppName  = mirrored ? "You" : aiName;
        return <MoggerResult round={round} you={you} opp={opp} youLabel={resultYouLabel} oppName={resultOppName} oppElo={mode === "ai" ? aiElo : null} oppTag={mode === "ai" ? aiPersona(aiElo).tag : null} oppPersona={mode === "ai" && !mirrored ? aiPersona(aiElo) : null} myElo={mode === "ai" && user ? user.elo : null} myCrank={user ? user.crank : null} eloMsg={eloMsg} practice={practice || mode === "ghost"} series={series} onAgain={again} onRematch={mode === "ai" ? rematch : mode === "ghost" ? rematchGhost : undefined} onNextGame={mode === "ai" ? nextSeriesGame : undefined} onAvenge={mode === "ai" ? avengeRival : undefined} onMenu={menu} onHistory={() => setScreen("history")} onSaveBuild={onSaveBuild} onMirror={() => { const tmp = you; setYou(opp); setOpp(tmp); setMirrored((m) => !m); eloAppliedRef.current = false; historyAppliedRef.current = false; setEloMsg(null); }} />;
      })()}
      {screen === "ban-phase" && round && <BanPhaseScreen round={round} myElo={user?.elo||1000} aiElo={aiElo} onBack={() => setScreen("diff")} onDone={(myBans, aiBans) => { setYouBannedParts(myBans); setAiBannedParts(aiBans); setScreen("taunt-pick"); }} />}
      {screen === "draft" && <MoggerDraft onMenu={menu} />}
      {screen === "rogue" && <MoggerRogueRun onMenu={menu} user={user} />}
      {screen === "archaeology" && <MoggerArchaeology onMenu={menu} onReplay={challengeGhost} />}
      {screen === "syndicate" && <MoggerSyndicate onMenu={menu} user={user} />}
    </div>
  );
}

function ForgeArt() {
  return (
    <div className="rf-forge-art" aria-hidden="true">
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="faGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#19e8db" stopOpacity="0.5" />
            <stop offset="55%" stopColor="#7c5cff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#7c5cff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="faEdge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#19e8db" /><stop offset="100%" stopColor="#7c5cff" />
          </linearGradient>
          <linearGradient id="faRGB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#19e8db" /><stop offset="50%" stopColor="#7c5cff" /><stop offset="100%" stopColor="#ff7ae0" />
          </linearGradient>
        </defs>
        <circle className="fa-coreglow" cx="200" cy="200" r="155" fill="url(#faGlow)" />
        <g className="fa-ring"><circle cx="200" cy="200" r="128" fill="none" stroke="#19e8db" strokeOpacity="0.25" strokeWidth="1.2" strokeDasharray="5 12" /></g>
        <g className="fa-ring2"><circle cx="200" cy="200" r="152" fill="none" stroke="#7c5cff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="2 16" /></g>
        {/* glowing ingot on the anvil, waiting to be forged */}
        <g className="fa-ingot">
          <ellipse cx="200" cy="214" rx="40" ry="9" fill="#000" fillOpacity="0.4" />
          <rect x="172" y="188" width="56" height="26" rx="8" fill="url(#faEdge)" />
          <rect x="172" y="188" width="56" height="26" rx="8" fill="#fff" fillOpacity="0.15" />
        </g>

        {/* ===== assembled FISH-TANK gaming PC (wide glass box) ===== */}
        <g className="fa-pc">
          <rect x="120" y="128" width="160" height="148" rx="14" fill="none" stroke="#19e8db" strokeOpacity="0.3" strokeWidth="8" className="fa-caseglow" />
          <rect x="120" y="128" width="160" height="148" rx="14" fill="#0b1018" stroke="url(#faEdge)" strokeWidth="2.5" />
          {/* glass front panel */}
          <rect x="128" y="136" width="144" height="132" rx="9" fill="#0e1626" stroke="#7c5cff" strokeOpacity="0.3" strokeWidth="1" />
          <rect x="128" y="136" width="60" height="132" rx="9" fill="#19e8db" fillOpacity="0.04" />
          {/* top-mounted RGB radiator fans */}
          <g className="fa-fan"><circle cx="155" cy="152" r="13" fill="none" stroke="#19e8db" strokeWidth="1.4" /><g className="fa-blades"><path d="M155 152 L155 142 M155 152 L163 158 M155 152 L147 158" stroke="#19e8db" strokeWidth="1.3" /></g><circle cx="155" cy="152" r="1.8" fill="#19e8db" /></g>
          <g className="fa-fan2"><circle cx="186" cy="152" r="13" fill="none" stroke="#7c5cff" strokeWidth="1.4" /><g className="fa-blades"><path d="M186 152 L186 142 M186 152 L194 158 M186 152 L178 158" stroke="#7c5cff" strokeWidth="1.3" /></g><circle cx="186" cy="152" r="1.8" fill="#7c5cff" /></g>
          <g className="fa-fan3"><circle cx="217" cy="152" r="13" fill="none" stroke="#ff7ae0" strokeWidth="1.4" /><g className="fa-blades"><path d="M217 152 L217 142 M217 152 L225 158 M217 152 L209 158" stroke="#ff7ae0" strokeWidth="1.3" /></g><circle cx="217" cy="152" r="1.8" fill="#ff7ae0" /></g>
          {/* vertical GPU showcased behind the glass, twin RGB fans facing out */}
          <rect x="140" y="180" width="32" height="80" rx="5" fill="#121a2b" stroke="#19e8db" strokeOpacity="0.7" strokeWidth="1.5" />
          <g className="fa-fan2"><circle cx="156" cy="200" r="11" fill="none" stroke="#19e8db" strokeWidth="1.4" /><g className="fa-blades"><path d="M156 200 L156 191 M156 200 L164 205 M156 200 L148 205" stroke="#19e8db" strokeWidth="1.3" /></g><circle cx="156" cy="200" r="1.8" fill="#19e8db" /></g>
          <g className="fa-fan"><circle cx="156" cy="232" r="11" fill="none" stroke="#7c5cff" strokeWidth="1.4" /><g className="fa-blades"><path d="M156 232 L156 223 M156 232 L164 237 M156 232 L148 237" stroke="#7c5cff" strokeWidth="1.3" /></g><circle cx="156" cy="232" r="1.8" fill="#7c5cff" /></g>
          {/* RAM sticks with RGB tops */}
          <rect x="196" y="180" width="5" height="34" rx="1.5" fill="#121a2b" stroke="#7c5cff" strokeOpacity="0.7" />
          <rect x="204" y="180" width="5" height="34" rx="1.5" fill="#121a2b" stroke="#7c5cff" strokeOpacity="0.7" />
          <rect x="195" y="177" width="15" height="4" rx="2" fill="#ff7ae0" className="fa-rgb" />
          {/* water-cooling reservoir tube with rising bubbles */}
          <rect x="224" y="178" width="12" height="80" rx="6" fill="#0c1320" stroke="#19e8db" strokeOpacity="0.5" />
          <rect x="226" y="180" width="8" height="76" rx="4" fill="url(#faRGB)" fillOpacity="0.4" className="fa-rgb" />
          <circle className="fa-bubble fa-b1" cx="230" cy="248" r="1.6" fill="#9be0ff" />
          <circle className="fa-bubble fa-b2" cx="231" cy="252" r="1.2" fill="#9be0ff" />
          <circle className="fa-bubble fa-b3" cx="229" cy="244" r="1.3" fill="#9be0ff" />
          {/* PSU / bottom shroud + RGB strip */}
          <rect x="132" y="252" width="136" height="14" rx="4" fill="#0c1320" stroke="#19e8db" strokeOpacity="0.3" />
          <rect x="252" y="178" width="12" height="68" rx="4" fill="url(#faRGB)" className="fa-rgb" />
          <circle cx="260" cy="142" r="2.2" fill="#46e0a0" className="fa-rgb" />
        </g>

        {/* flash when it snaps together */}
        <circle className="fa-flash" cx="200" cy="200" r="74" fill="url(#faGlow)" />

        {/* sparks bursting from the strike point */}
        <g className="fa-sparks" stroke="#ffd24a" strokeWidth="2.4" strokeLinecap="round" fill="#ffd24a">
          <line x1="200" y1="190" x2="200" y2="168" />
          <line x1="200" y1="190" x2="222" y2="176" />
          <line x1="200" y1="190" x2="178" y2="176" />
          <line x1="200" y1="190" x2="232" y2="192" />
          <line x1="200" y1="190" x2="168" y2="192" />
          <line x1="200" y1="190" x2="216" y2="206" />
          <line x1="200" y1="190" x2="184" y2="206" />
          <circle cx="238" cy="170" r="2.2" /><circle cx="162" cy="172" r="2" /><circle cx="226" cy="208" r="1.8" />
        </g>

        {/* ===== the pickaxe that forges it ===== */}
        <g className="fa-pick">
          <line x1="252" y1="96" x2="194" y2="152" stroke="#c98a4b" strokeWidth="6.5" strokeLinecap="round" />
          <line x1="252" y1="96" x2="194" y2="152" stroke="#8a5a2b" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M166 152 Q194 130 222 152 Q210 158 194 153 Q178 158 166 152 Z" fill="#cdd7e6" stroke="#19e8db" strokeWidth="1.8" />
          <path d="M166 152 Q194 137 222 152" fill="none" stroke="#9fb0c4" strokeWidth="1" />
          <circle cx="194" cy="152" r="3" fill="#8a5a2b" />
        </g>
      </svg>
    </div>
  );
}
function CompletenessRing({ parts, useCase }) {
  const total = CATEGORY_ORDER.length;
  const filled = CATEGORY_ORDER.filter(c => parts && parts[c]).length;
  const pct = filled / total;
  const r = 14, cx = 16, cy = 16, circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const color = pct === 1 ? "var(--c-good)" : pct >= 0.625 ? "var(--c-accent)" : "var(--c-warn)";
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" style={{flexShrink:0}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--c-border)" strokeWidth="3" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy+4} textAnchor="middle" fontSize="9" fill={color} fontWeight="bold">{filled}/{total}</text>
    </svg>
  );
}

function Home({ saved, loading, onNew, onOpen, onDelete, priceInfo, onMogger, onClone }) {
  const [search, setSearch] = useState("");
  const [pins, setPins] = useState(() => { try { return JSON.parse(localStorage.getItem("rf_pins") || "[]"); } catch(e) { return []; } });
  const togglePin = (id, e) => { e.stopPropagation(); const next = pins.includes(id) ? pins.filter(x => x !== id) : [...pins, id]; setPins(next); try { localStorage.setItem("rf_pins", JSON.stringify(next)); } catch(e2) {} };
  const filtered = saved.filter(b => !search || (b.name || "").toLowerCase().includes(search.toLowerCase()));
  const sorted = [...filtered].sort((a, b2) => { const ap = pins.includes(a.id) ? 1 : 0; const bp = pins.includes(b2.id) ? 1 : 0; return bp - ap; });
  return (
    <div className="rf-fade">
      <div className="rf-hero rf-hero-flash">
        <div className="rf-hero-text">
          <div className="rf-eyebrow">PART PICKER · COMPATIBILITY · SCORING</div>
          <h1 className="rf-hero-title">How to forge the<br /><span className="rf-accent rf-hero-grad">perfect computer.</span></h1>
          <p className="rf-muted rf-hero-sub">
            Tell us your use case and budget. We score every part, auto-assemble a balanced build,
            check full compatibility, and grade the result out of 100.
          </p>
          <div className="rf-cta-grid">
            <div className="rf-cta-card">
              <button className="rf-btn rf-btn-lg" onClick={onNew}><Plus size={18} /> {t("startBuild")}</button>
              <span className="rf-cta-desc">Answer two quick questions — we auto-pick balanced, compatible parts for your budget and grade the result out of 100.</span>
            </div>
            {onMogger && (
              <div className="rf-cta-card">
                <button className="rf-btn rf-btn-lg rf-mogger-cta" onClick={onMogger}><Gamepad2 size={18} /> Play PC Duels</button>
                <span className="rf-cta-desc">A head-to-head build-off game — assemble the best PC for a budget and use case, then beat players or AI to climb the elo leaderboard.</span>
              </div>
            )}
          </div>
          <div className="rf-price-status">
            <span className="rf-db-count"><Boxes size={13} /> {CATALOG_COUNT} {t("componentsDb")}</span>
            <span className="rf-dot-sep">·</span>
            <span className="rf-live-ind"><span className="rf-live-dot" /> {t("livePrices")}</span>
            {priceInfo && <> · {t("updated")} {new Date(priceInfo.updatedAt).toLocaleDateString()}</>}
          </div>
        </div>
        <ForgeArt />
      </div>

      <div className="rf-section-head">
        <h2>{t("myRigs")}</h2>
        <span className="rf-muted">{saved.length} {t("savedWord")}</span>
      </div>

      {!loading && saved.length > 0 && (
        <div style={{padding:"0 0 12px 0",maxWidth:"340px"}}>
          <input className="rf-input" placeholder="Search rigs…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )}

      {loading ? (
        <div className="rf-muted rf-pad">{t("loadingRigs")}</div>
      ) : saved.length === 0 ? (
        <div className="rf-empty">
          <Boxes size={30} className="rf-muted" />
          <p className="rf-muted">{t("noRigs")}</p>
        </div>
      ) : (
        <div className="rf-saved-grid">
          {sorted.map((b, i) => {
            const UC = USE_CASES[b.useCase];
            const pinned = pins.includes(b.id);
            // R17: find top-scoring category for glassmorphism blob color
            const topCat = CATEGORY_ORDER.reduce((best, c) => {
              const uc = USE_CASES[b.useCase] || USE_CASES.gaming;
              return (uc.alloc[c] || 0) > (USE_CASES[b.useCase]?.alloc[best] || 0) ? c : best;
            }, CATEGORY_ORDER[0]);
            const blobColors = { cpu:"#60a5fa", gpu:"#a07aff", mobo:"#34d399", ram:"#1ff5e6", storage:"#f59e0b", psu:"#fb923c", case:"#f472b6", cooler:"#a3e635" };
            const blobColor = blobColors[topCat] || "var(--c-accent)";
            return (
              <div key={b.id} className={"rf-saved-card rf-pop" + (pinned ? " rf-pinned" : "")} style={{ animationDelay: i * 60 + "ms", "--blob-color": blobColor }} onClick={() => onOpen(b)}>
                <div className="rf-saved-top">
                  <div className="rf-saved-uc"><UC.Icon size={15} /> {tUC(b.useCase)}</div>
                  <div style={{display:"flex",gap:"4px",alignItems:"center"}}>
                    <button className="rf-icon-btn" title={pinned ? "Unpin" : "Pin to top"} onClick={(e) => togglePin(b.id, e)} style={{color: pinned ? "var(--c-accent)" : undefined}}>⭐</button>
                    {onClone && <button className="rf-icon-btn" title="Clone build" onClick={(e) => { e.stopPropagation(); onClone(b); }}>⧉</button>}
                    <button className="rf-icon-btn" onClick={(e) => { e.stopPropagation(); onDelete(b.id); }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="rf-saved-name" style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <CompletenessRing parts={b.parts} useCase={b.useCase} />
                  <span>{b.name}</span>
                </div>
                {b.note && <div className="rf-build-note">{b.note}</div>}
                <div className="rf-saved-scores">
                  <div className="rf-mini-score">
                    <span className="rf-mini-num" style={{ color: scoreColor(b.overallScore / 10) }}>{b.overallScore}</span>
                    <span className="rf-mini-lbl">Perf</span>
                  </div>
                  <div className="rf-mini-score">
                    <span className="rf-mini-num" style={{ color: scoreColor(b.ppScore) }}>{b.ppScore}</span>
                    <span className="rf-mini-lbl">Price/Perf</span>
                  </div>
                  <div className="rf-saved-price">{fmt(b.total)}</div>
                </div>
                <div className="rf-saved-parts">
                  {CATEGORY_ORDER.map((c) => {
                    const pt = b.parts[c];
                    const noGpu = c === "gpu" && !pt && USE_CASES[b.useCase].alloc.gpu === 0;
                    if (!pt && !noGpu) return null;
                    return (
                      <div key={c} className="rf-saved-part">
                        <span className="rf-saved-part-thumb">
                          {pt && pt.img
                            ? <img src={pt.img} alt="" loading="lazy" />
                            : React.createElement(CAT_META[c].Icon, { size: 14 })}
                        </span>
                        <span className="rf-saved-part-cat">{tCat(c)}</span>
                        <span className="rf-saved-part-name">{pt ? pt.name : "Integrated graphics"}</span>
                      </div>
                    );
                  })}
                </div>
                {!b.compatPass && <div className="rf-incompat"><ShieldAlert size={13} /> Has compatibility issues</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- COMMUNITY BUILDS ----------------------------- */
function CommunityBuilds({ user, onLogin, onBack }) {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [deleting, setDeleting] = useState(null);
  // share modal state
  const [shareOpen, setShareOpen] = useState(false);
  const [myBuilds, setMyBuilds] = useState([]);
  const [myBuildsLoading, setMyBuildsLoading] = useState(false);
  const [pickedBuild, setPickedBuild] = useState(null);
  const [shareTitle, setShareTitle] = useState("");
  const [shareStatus, setShareStatus] = useState(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const data = await netListCommunity(100);
    setBuilds(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openShare = async () => {
    setShareOpen(true);
    setPickedBuild(null);
    setShareTitle("");
    setShareStatus(null);
    setSearch("");
    setMyBuildsLoading(true);
    const data = await netListBuilds(user.id);
    setMyBuilds(data);
    setMyBuildsLoading(false);
  };

  const FREE_TIER_LIMIT = 5;
  const doPost = async () => {
    if (!pickedBuild || !shareTitle.trim()) return;
    setShareStatus("posting");
    const existing = await netCountCommunity(user.id);
    if (existing >= FREE_TIER_LIMIT) { setShareStatus("limit"); return; }
    const b = pickedBuild;
    const analysis = moggerScore(b.parts || {}, b.useCase, b.budget);
    const res = await netPostCommunity(user.id, user.name, {
      title: shareTitle.trim(),
      useCase: b.useCase,
      budget: b.budget,
      total: b.total || analysis.spend,
      perfScore: b.overallScore || analysis.perf,
      parts: b.parts || {},
    });
    if (res.ok) {
      setShareStatus("done");
      setTimeout(() => { setShareOpen(false); load(); }, 1200);
    } else {
      setShareStatus("error:" + (res.error || "unknown"));
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    await netDeleteCommunity(id, user.id);
    setBuilds(b => b.filter(x => x.id !== id));
    setDeleting(null);
  };

  const filtered = filter === "all" ? builds : builds.filter(b => b.use_case === filter);
  const ucKeys = [...new Set(builds.map(b => b.use_case).filter(Boolean))];
  const filteredMyBuilds = myBuilds.filter(b => !search || (b.name || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="rf-fade rf-community">
      <div className="rf-section-head" style={{marginBottom:"1.25rem"}}>
        <div>
          <h2 style={{margin:0}}><Globe size={18} style={{verticalAlign:"middle",marginRight:"6px"}} />Community Builds</h2>
          <p className="rf-muted" style={{marginTop:"0.3rem",fontSize:"0.85rem"}}>Builds shared by the FORGEAPC community</p>
        </div>
        {user ? (
          <button className="rf-btn" onClick={openShare}><Plus size={15} /> Share a build</button>
        ) : (
          <button className="rf-btn" onClick={onLogin}><Users size={15} /> Log in to share</button>
        )}
      </div>

      {/* use-case filter pills */}
      <div className="rf-community-filters">
        <button className={"rf-pill" + (filter === "all" ? " active" : "")} onClick={() => setFilter("all")}>All</button>
        {ucKeys.map(k => {
          const UC = USE_CASES[k];
          if (!UC) return null;
          return <button key={k} className={"rf-pill" + (filter === k ? " active" : "")} onClick={() => setFilter(k)}><UC.Icon size={12} /> {tUC(k)}</button>;
        })}
      </div>

      {loading ? (
        <div className="rf-muted rf-pad">Loading community builds…</div>
      ) : filtered.length === 0 ? (
        <div className="rf-empty">
          <Globe size={30} className="rf-muted" />
          <p className="rf-muted">{builds.length === 0 ? "No builds shared yet. Be the first!" : "No builds for this use case."}</p>
        </div>
      ) : (
        <div className="rf-saved-grid">
          {filtered.map((b, i) => {
            const UC = b.use_case && USE_CASES[b.use_case];
            const parts = b.parts || {};
            const isOwn = user && user.id === b.user_id;
            return (
              <div key={b.id} className="rf-saved-card rf-pop" style={{ animationDelay: i * 40 + "ms" }}>
                <div className="rf-saved-top">
                  <div className="rf-saved-uc">{UC ? <><UC.Icon size={15} /> {tUC(b.use_case)}</> : b.use_case}</div>
                  {isOwn && (
                    <button className="rf-icon-btn" onClick={() => handleDelete(b.id)} disabled={deleting === b.id} title="Delete your post">
                      {deleting === b.id ? "…" : <Trash2 size={15} />}
                    </button>
                  )}
                </div>
                <div className="rf-saved-name">{b.title}</div>
                <div className="rf-community-meta">
                  <span className="rf-muted" style={{fontSize:"0.78rem"}}><Users size={11} style={{verticalAlign:"middle"}} /> {b.user_name}</span>
                  {b.perf_score != null && <span className="rf-mini-num" style={{color:scoreColor(b.perf_score/10),fontSize:"0.85rem"}}>{b.perf_score} <span style={{color:"var(--c-muted)",fontSize:"0.75rem"}}>perf</span></span>}
                  {b.total > 0 && <span className="rf-muted" style={{fontSize:"0.8rem"}}>{fmt(b.total)}</span>}
                </div>
                <div className="rf-saved-parts">
                  {CATEGORY_ORDER.map(c => {
                    const pt = parts[c];
                    if (!pt) return null;
                    return (
                      <div key={c} className="rf-saved-part">
                        <span className="rf-saved-part-cat">{tCat(c)}</span>
                        <span className="rf-saved-part-name">{pt.name || pt.model || "—"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Share modal — pick a saved build */}
      {shareOpen && (
        <div className="rf-modal-wrap" onClick={() => setShareOpen(false)}>
          <div className="rf-modal" style={{maxWidth:"480px",maxHeight:"80vh",display:"flex",flexDirection:"column"}} onClick={e => e.stopPropagation()}>
            <div className="rf-modal-head"><Upload size={16} /> Share a Build to Community</div>

            {!pickedBuild ? (
              <>
                <p className="rf-muted" style={{fontSize:"0.85rem",marginBottom:"0.75rem"}}>Pick one of your saved builds to share.</p>
                <div style={{position:"relative",marginBottom:"0.75rem"}}>
                  <Search size={14} style={{position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",color:"var(--c-muted)"}} />
                  <input className="rf-input" style={{paddingLeft:"32px"}} placeholder="Search your builds…" value={search} onChange={e => setSearch(e.target.value)} autoFocus />
                </div>
                <div style={{overflowY:"auto",flex:1,display:"flex",flexDirection:"column",gap:"8px"}}>
                  {myBuildsLoading ? (
                    <p className="rf-muted" style={{fontSize:"0.85rem"}}>Loading your builds…</p>
                  ) : filteredMyBuilds.length === 0 ? (
                    <p className="rf-muted" style={{fontSize:"0.85rem"}}>{myBuilds.length === 0 ? "No saved builds found. Save a build first." : "No builds match your search."}</p>
                  ) : filteredMyBuilds.map(b => {
                    const UC = b.useCase && USE_CASES[b.useCase];
                    return (
                      <div key={b.id} className="rf-community-pick-row" onClick={() => { setPickedBuild(b); setShareTitle(b.name || ""); }}>
                        <div style={{display:"flex",alignItems:"center",gap:"8px",minWidth:0}}>
                          {UC && <UC.Icon size={14} style={{color:"var(--c-accent)",flexShrink:0}} />}
                          <span style={{fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.name}</span>
                        </div>
                        <span className="rf-muted" style={{fontSize:"0.8rem",flexShrink:0}}>{fmt(b.total || 0)}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="rf-community-pick-row" style={{marginBottom:"0.75rem",cursor:"default"}}>
                  {pickedBuild.useCase && USE_CASES[pickedBuild.useCase] && React.createElement(USE_CASES[pickedBuild.useCase].Icon, {size:14, style:{color:"var(--c-accent)"}})}
                  <span style={{fontWeight:600}}>{pickedBuild.name}</span>
                  <button className="rf-ghost" style={{marginLeft:"auto",fontSize:"0.8rem",padding:"2px 8px"}} onClick={() => setPickedBuild(null)}>Change</button>
                </div>
                <p className="rf-muted" style={{fontSize:"0.85rem",marginBottom:"0.5rem"}}>Give your post a title:</p>
                <input className="rf-input" placeholder="e.g. Budget Gaming Beast $1500" value={shareTitle} onChange={e => setShareTitle(e.target.value)} maxLength={80} onKeyDown={e => e.key === "Enter" && doPost()} autoFocus />
                {shareStatus === "done" && <p style={{color:"var(--c-accent)",marginTop:"0.4rem",fontSize:"0.85rem"}}>Posted!</p>}
                {shareStatus && shareStatus.startsWith("error") && <p style={{color:"var(--c-bad)",marginTop:"0.4rem",fontSize:"0.85rem"}}>Error — {shareStatus.replace("error:","")}</p>}
                {shareStatus === "limit" && <p style={{color:"var(--c-warn)",marginTop:"0.4rem",fontSize:"0.85rem"}}>Free tier limit: max 5 posts. Delete one to share another.</p>}
              </>
            )}

            <div className="rf-modal-row" style={{marginTop:"1rem"}}>
              <button className="rf-ghost" onClick={() => setShareOpen(false)}>Cancel</button>
              {pickedBuild && <button className="rf-btn" onClick={doPost} disabled={!shareTitle.trim() || shareStatus === "posting" || shareStatus === "done"}><Upload size={15} /> {shareStatus === "posting" ? "Posting…" : "Post"}</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- 3D BUILD VIEWER ----------------------------- */
const BuildViewer3D = React.lazy(() => import("./BuildViewer3D.jsx"));

/* ----------------------------- PARTS EXPLORER ----------------------------- */
function PartsExplorer({ onBack }) {
  const [cat, setCat] = useState("gpu");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("perf");
  const [maxPrice, setMaxPrice] = useState(2000);

  const pool = (CATALOG[cat] || []).filter(p => {
    if (search && !(p.name || "").toLowerCase().includes(search.toLowerCase()) && !(p.brand || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (p.price > maxPrice) return false;
    return true;
  }).slice().sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "priceDesc") return b.price - a.price;
    return (b.perf || 0) - (a.perf || 0);
  });

  const maxInCat = Math.max(...(CATALOG[cat] || []).map(p => p.price || 0), 500);

  return (
    <div className="rf-fade rf-parts-explorer">
      <div className="rf-section-head" style={{marginBottom:"1rem"}}>
        <div>
          <h2 style={{margin:0}}><PackageSearch size={18} style={{verticalAlign:"middle",marginRight:"6px"}} />Parts Explorer</h2>
          <p className="rf-muted" style={{marginTop:"0.3rem",fontSize:"0.85rem"}}>Browse all {Object.values(CATALOG).flat().length} parts in the database</p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="rf-community-filters" style={{marginBottom:"1rem"}}>
        {CATEGORY_ORDER.filter(c => CATALOG[c]?.length).map(c => (
          <button key={c} className={"rf-pill" + (cat === c ? " active" : "")} onClick={() => { setCat(c); setMaxPrice(Math.max(...(CATALOG[c]||[]).map(p=>p.price||0),500)); setSearch(""); }}>{tCat(c)}</button>
        ))}
      </div>

      {/* Filters row */}
      <div className="rf-pe-filters">
        <div style={{position:"relative",flex:1}}>
          <Search size={14} style={{position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",color:"var(--c-muted)"}} />
          <input className="rf-input" style={{paddingLeft:"32px",marginBottom:0}} placeholder={`Search ${tCat(cat)}s…`} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="rf-input" style={{width:"auto",marginBottom:0}} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="perf">Sort: Performance</option>
          <option value="price">Sort: Price ↑</option>
          <option value="priceDesc">Sort: Price ↓</option>
        </select>
        <div className="rf-pe-price-wrap">
          <span className="rf-muted" style={{fontSize:"0.8rem",whiteSpace:"nowrap"}}>Max: {fmt(maxPrice)}</span>
          <input type="range" min={0} max={maxInCat} step={10} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="rf-slider" />
        </div>
      </div>

      <div className="rf-muted" style={{fontSize:"0.8rem",marginBottom:"0.75rem"}}>{pool.length} parts shown</div>

      <div className="rf-pe-grid">
        {pool.map((p, i) => {
          const score = Math.round(ucPerf(cat, p, cat === "gpu" ? "gaming" : cat === "cpu" ? "gaming" : cat));
          return (
            <div key={p.id || i} className="rf-pe-card">
              <div className="rf-pe-name">{p.name}</div>
              {p.brand && <div className="rf-muted" style={{fontSize:"0.75rem"}}>{p.brand}</div>}
              <div className="rf-pe-specs">
                {cat === "cpu" && p.cores && <span>{p.cores}c</span>}
                {cat === "gpu" && p.vram && <span>{p.vram}GB VRAM</span>}
                {cat === "ram" && p.cap && <span>{p.cap}GB</span>}
                {cat === "storage" && p.cap && <span>{p.cap}GB</span>}
                {cat === "psu" && p.watt && <span>{p.watt}W</span>}
                {p.perf != null && <span className="rf-pe-perf" style={{color: scoreColor(p.perf)}}>{p.perf} perf</span>}
              </div>
              <div className="rf-pe-bottom">
                <span className="rf-pe-price">{fmt(p.price)}</span>
                {p.perf != null && <div className="rf-pe-bar"><div style={{width: clamp(p.perf,0,100)+"%", background: scoreColor(p.perf), height:"100%", borderRadius:"2px"}} /></div>}
              </div>
            </div>
          );
        })}
        {pool.length === 0 && <p className="rf-muted">No parts match your filters.</p>}
      </div>
    </div>
  );
}

/* ----------------------------- COMPARE BUILDS ----------------------------- */
function CompareBuilds({ saved, onBack }) {
  const [pickA, setPickA] = useState(null);
  const [pickB, setPickB] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = saved.filter(b => !search || (b.name||"").toLowerCase().includes(search.toLowerCase()));

  const scoreA = pickA ? moggerScore(pickA.parts||{}, pickA.useCase, pickA.budget) : null;
  const scoreB = pickB ? moggerScore(pickB.parts||{}, pickB.useCase, pickB.budget) : null;

  const winner = (va, vb) => {
    if (va == null || vb == null) return null;
    if (va > vb) return "a";
    if (vb > va) return "b";
    return "tie";
  };

  const BuildPicker = ({ value, onChange, label }) => (
    <div className="rf-compare-picker">
      <div className="rf-compare-slot-label">{label}</div>
      {value ? (
        <div className="rf-compare-chosen">
          <div style={{fontWeight:600,fontSize:"0.9rem"}}>{value.name}</div>
          <div className="rf-muted" style={{fontSize:"0.78rem"}}>{tUC(value.useCase)} · {fmt(value.budget)}</div>
          <button className="rf-ghost" style={{fontSize:"0.78rem",padding:"3px 8px",marginTop:"4px"}} onClick={() => onChange(null)}>Change</button>
        </div>
      ) : (
        <div className="rf-compare-empty">
          <p className="rf-muted" style={{fontSize:"0.85rem",marginBottom:"0.5rem"}}>Pick a saved build</p>
          <div style={{position:"relative",marginBottom:"0.5rem"}}>
            <Search size={13} style={{position:"absolute",left:"8px",top:"50%",transform:"translateY(-50%)",color:"var(--c-muted)"}} />
            <input className="rf-input" style={{paddingLeft:"28px",marginBottom:0,fontSize:"0.82rem"}} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{maxHeight:"160px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"5px"}}>
            {filtered.length === 0 && <p className="rf-muted" style={{fontSize:"0.8rem"}}>No saved builds found.</p>}
            {filtered.map(b => (
              <div key={b.id} className="rf-community-pick-row" style={{fontSize:"0.82rem"}} onClick={() => onChange(b)}>
                <span style={{fontWeight:600}}>{b.name}</span>
                <span className="rf-muted" style={{marginLeft:"auto",fontSize:"0.76rem"}}>{fmt(b.total||0)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="rf-fade rf-compare">
      <div className="rf-section-head" style={{marginBottom:"1.25rem"}}>
        <div>
          <h2 style={{margin:0}}><Columns2 size={18} style={{verticalAlign:"middle",marginRight:"6px"}} />Compare Builds</h2>
          <p className="rf-muted" style={{marginTop:"0.3rem",fontSize:"0.85rem"}}>Pick two saved builds to compare side by side</p>
        </div>
      </div>

      <div className="rf-compare-pickers">
        <BuildPicker value={pickA} onChange={setPickA} label="Build A" />
        <div className="rf-compare-vs">VS</div>
        <BuildPicker value={pickB} onChange={setPickB} label="Build B" />
      </div>

      {pickA && pickB && (
        <div className="rf-compare-table">
          {/* Header */}
          <div className="rf-compare-row rf-compare-head">
            <div className="rf-compare-cat"></div>
            <div className={"rf-compare-cell" + (winner(scoreA?.total, scoreB?.total) === "a" ? " win" : "")}>{pickA.name}</div>
            <div className={"rf-compare-cell" + (winner(scoreA?.total, scoreB?.total) === "b" ? " win" : "")}>{pickB.name}</div>
          </div>

          {/* Overall scores */}
          <div className="rf-compare-row rf-compare-score-row">
            <div className="rf-compare-cat">Overall</div>
            <div className={"rf-compare-cell" + (winner(scoreA?.total, scoreB?.total) === "a" ? " win" : "")}>
              <span style={{color:scoreColor((scoreA?.total||0)/10),fontWeight:700,fontSize:"1.1rem"}}>{scoreA?.total || "—"}</span>
            </div>
            <div className={"rf-compare-cell" + (winner(scoreA?.total, scoreB?.total) === "b" ? " win" : "")}>
              <span style={{color:scoreColor((scoreB?.total||0)/10),fontWeight:700,fontSize:"1.1rem"}}>{scoreB?.total || "—"}</span>
            </div>
          </div>
          <div className="rf-compare-row">
            <div className="rf-compare-cat">Performance</div>
            <div className={"rf-compare-cell" + (winner(scoreA?.perf, scoreB?.perf) === "a" ? " win" : "")}>{scoreA?.perf ?? "—"}</div>
            <div className={"rf-compare-cell" + (winner(scoreA?.perf, scoreB?.perf) === "b" ? " win" : "")}>{scoreB?.perf ?? "—"}</div>
          </div>
          <div className="rf-compare-row">
            <div className="rf-compare-cat">Price/Perf</div>
            <div className={"rf-compare-cell" + (winner(scoreA?.ppScore, scoreB?.ppScore) === "a" ? " win" : "")}>{scoreA?.ppScore ?? "—"}</div>
            <div className={"rf-compare-cell" + (winner(scoreA?.ppScore, scoreB?.ppScore) === "b" ? " win" : "")}>{scoreB?.ppScore ?? "—"}</div>
          </div>
          <div className="rf-compare-row">
            <div className="rf-compare-cat">Spent</div>
            <div className={"rf-compare-cell" + (winner(scoreB?.spend, scoreA?.spend) === "b" ? " win" : "")}>{fmt(scoreA?.spend || 0)}</div>
            <div className={"rf-compare-cell" + (winner(scoreB?.spend, scoreA?.spend) === "a" ? " win" : "")}>{fmt(scoreB?.spend || 0)}</div>
          </div>

          {/* Per-part comparison */}
          <div className="rf-compare-row rf-compare-section-head">
            <div className="rf-compare-cat">Component</div>
            <div className="rf-compare-cell">{pickA.name}</div>
            <div className="rf-compare-cell">{pickB.name}</div>
          </div>
          {CATEGORY_ORDER.map(c => {
            const pa = pickA.parts?.[c];
            const pb = pickB.parts?.[c];
            if (!pa && !pb) return null;
            const perfA = pa ? ucPerf(c, pa, pickA.useCase) : 0;
            const perfB = pb ? ucPerf(c, pb, pickB.useCase) : 0;
            const w = winner(perfA, perfB);
            return (
              <div key={c} className="rf-compare-row">
                <div className="rf-compare-cat">{tCat(c)}</div>
                <div className={"rf-compare-cell" + (w === "a" ? " win" : "")}>
                  <div style={{fontWeight:500,fontSize:"0.82rem"}}>{pa ? (pa.name||"—") : <span className="rf-muted">None</span>}</div>
                  {pa && <div className="rf-muted" style={{fontSize:"0.74rem"}}>{fmt(pa.price)} · {Math.round(perfA)} perf</div>}
                </div>
                <div className={"rf-compare-cell" + (w === "b" ? " win" : "")}>
                  <div style={{fontWeight:500,fontSize:"0.82rem"}}>{pb ? (pb.name||"—") : <span className="rf-muted">None</span>}</div>
                  {pb && <div className="rf-muted" style={{fontSize:"0.74rem"}}>{fmt(pb.price)} · {Math.round(perfB)} perf</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(!pickA || !pickB) && (
        <div className="rf-empty" style={{marginTop:"2rem"}}>
          <Columns2 size={30} className="rf-muted" />
          <p className="rf-muted">Select two builds above to see the comparison</p>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- LAUNCH CALENDAR ----------------------------- */
const LAUNCHES = [
  { date: "2026-07", cat: "GPU",  name: "NVIDIA RTX 5090 Ti",         status: "rumored",   note: "Flagship Ada refresh" },
  { date: "2026-Q3", cat: "GPU",  name: "AMD RX 9080 XT",             status: "rumored",   note: "RDNA 4 high-end" },
  { date: "2026-08", cat: "CPU",  name: "AMD Ryzen 9000X3D series",   status: "confirmed", note: "3D V-Cache on Zen 5" },
  { date: "2026-Q3", cat: "CPU",  name: "Intel Arrow Lake Refresh",   status: "rumored",   note: "Core Ultra 300 lineup" },
  { date: "2026-09", cat: "GPU",  name: "NVIDIA RTX 5070 Super",      status: "rumored",   note: "Mid-range Blackwell" },
  { date: "2026-Q4", cat: "GPU",  name: "AMD RX 9060 XT",            status: "rumored",   note: "Budget RDNA 4" },
  { date: "2026-Q4", cat: "CPU",  name: "AMD Ryzen Threadripper 7000",status: "confirmed", note: "HEDT / workstation" },
  { date: "2027-Q1", cat: "GPU",  name: "NVIDIA RTX 6000 series",    status: "rumored",   note: "Next-gen Rubin arch" },
  { date: "2027-Q1", cat: "CPU",  name: "AMD Zen 6 (Medusa)",        status: "rumored",   note: "Next-gen consumer CPU" },
  { date: "2027-Q2", cat: "CPU",  name: "Intel Nova Lake",            status: "rumored",   note: "Post-Arrow Lake desktop" },
];

function LaunchCalendar() {
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? LAUNCHES : LAUNCHES.filter(l => l.cat === filter);
  const statusColor = s => s === "confirmed" ? "var(--c-good)" : s === "rumored" ? "var(--c-warn)" : "var(--c-muted)";
  return (
    <div className="rf-fade rf-community">
      <div className="rf-section-head" style={{marginBottom:"1rem"}}>
        <div>
          <h2 style={{margin:0}}>🗓 Upcoming Launches</h2>
          <p className="rf-muted" style={{marginTop:"0.3rem",fontSize:"0.85rem"}}>Rumored and confirmed GPU / CPU release dates</p>
        </div>
      </div>
      <div className="rf-community-filters" style={{marginBottom:"1rem"}}>
        {["All","GPU","CPU"].map(f => <button key={f} className={"rf-pill"+(filter===f?" active":"")} onClick={()=>setFilter(f)}>{f}</button>)}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
        {shown.map((l,i) => (
          <div key={i} className="rf-pe-card" style={{flexDirection:"row",alignItems:"center",gap:"14px"}}>
            <div style={{fontFamily:"'JetBrains Mono'",fontSize:"0.78rem",color:"var(--c-muted)",minWidth:"70px"}}>{l.date}</div>
            <span className="rf-pill" style={{fontSize:"0.72rem",padding:"2px 8px",borderColor: l.cat==="GPU"?"var(--c-accent2)":"var(--c-accent)",color: l.cat==="GPU"?"var(--c-accent2)":"var(--c-accent)"}}>{l.cat}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:"0.88rem"}}>{l.name}</div>
              <div className="rf-muted" style={{fontSize:"0.76rem"}}>{l.note}</div>
            </div>
            <span style={{fontSize:"0.76rem",color:statusColor(l.status),textTransform:"capitalize"}}>{l.status}</span>
          </div>
        ))}
      </div>
      <p className="rf-muted" style={{fontSize:"0.75rem",marginTop:"1.5rem"}}>Dates are estimates based on public leaks and announcements. Subject to change.</p>
    </div>
  );
}

/* ----------------------------- TOOLS VIEW (Batches 3 & 4) ----------------------------- */
const SALE_DATES = [
  { name: "Amazon Prime Day", date: "Mid-July 2026", tip: "Best time for RAM and SSDs." },
  { name: "Back to School", date: "Aug 2026", tip: "Monitors and budget CPUs often drop." },
  { name: "Black Friday", date: "Nov 28, 2026", tip: "Historically the best GPU deals of the year." },
  { name: "Cyber Monday", date: "Dec 1, 2026", tip: "Online-only. Great for full build bundles." },
  { name: "New Year Sales", date: "Jan 2027", tip: "Newegg and B&H run post-holiday clearances." },
  { name: "CES Launch Window", date: "Jan 2027", tip: "New GPU/CPU launches drive last-gen prices down." },
];

// Shown inside any More view when no active build is loaded.
// Lets the user search and pick from their saved rigs without leaving the view.
function NoBuildPicker({ saved, onPick }) {
  const [q, setQ] = useState("");
  const list = (saved || []).filter((b) =>
    !q || (b.name || "").toLowerCase().includes(q.toLowerCase()) || ((USE_CASES[b.useCase] || {}).label || "").toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="rf-no-build-picker">
      <p className="rf-muted" style={{ marginBottom: "12px" }}>No active build — pick one of your saved rigs to analyse it here:</p>
      <input className="rf-input" placeholder="Search saved builds…" value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: "10px" }} />
      {list.length === 0 && <p className="rf-muted" style={{ fontSize: "0.82rem" }}>{(saved || []).length === 0 ? "No saved builds yet. Build and save one first." : "No builds match your search."}</p>}
      <div className="rf-no-build-list">
        {list.map((b) => (
          <button key={b.id} className="rf-no-build-card" onClick={() => onPick(b)}>
            <span className="rf-no-build-name">{b.name || "Untitled build"}</span>
            <span className="rf-no-build-meta">{(USE_CASES[b.useCase] || {}).label || b.useCase} · {fmt(b.budget || 0)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ToolsView({ parts: propParts, analysis: propAnalysis, useCase: propUseCase, budget: propBudget, onBack, saved }) {
  const [localBuild, setLocalBuild] = useState(null);
  const parts = localBuild ? localBuild.parts : propParts;
  const useCase = localBuild ? localBuild.useCase : propUseCase;
  const budget = localBuild ? localBuild.budget : propBudget;
  const analysis = useMemo(() => localBuild ? analyzeBuild(localBuild.parts, localBuild.useCase, localBuild.budget) : propAnalysis, [localBuild, propAnalysis]);
  const handleBack = () => { if (localBuild) { setLocalBuild(null); return; } onBack(); };
  const total = parts ? CATEGORY_ORDER.reduce((s,c) => s + (parts[c]?.price || 0), 0) : 0;
  const [payMonths, setPayMonths] = useState(12);
  const [payInterest, setPayInterest] = useState(0);
  const [listCopied, setListCopied] = useState(false);
  // C12: Monthly cost planner, cashback, tax
  const [monthlySavings, setMonthlySavings] = useState(200);
  const [cashbackPct, setCashbackPct] = useState(2);
  const [taxRate, setTaxRate] = useState(8.5);
  const monthsToSave = total > 0 && monthlySavings > 0 ? Math.ceil(total / monthlySavings) : null;
  const cashbackAmt = total > 0 ? (total * cashbackPct / 100).toFixed(2) : "0.00";
  const totalWithTax = total > 0 ? (total * (1 + taxRate / 100)).toFixed(2) : "0.00";
  const taxAmt = total > 0 ? (total * taxRate / 100).toFixed(2) : "0.00";

  // 14 — budget breakdown
  const breakdown = parts ? CATEGORY_ORDER.filter(c => parts[c]).map(c => ({
    cat: tCat(c), price: parts[c].price, pct: Math.round((parts[c].price / total) * 100),
  })) : [];
  const COLORS = ["var(--c-accent)","var(--c-accent2)","var(--c-good)","var(--c-warn)","var(--c-bad)","#ff9f43","#a29bfe","#fd79a8"];

  // 15 — lifespan value
  const lifespan = total > 0 ? {
    yr3: (total / (365*3)).toFixed(2),
    yr5: (total / (365*5)).toFixed(2),
    yr7: (total / (365*7)).toFixed(2),
  } : null;

  // 16 — upgrade cost advisor: next-tier part per category
  const upgradeTips = parts ? CATEGORY_ORDER.filter(c => parts[c]).map(c => {
    const cur = parts[c];
    const nextTier = CATALOG[c].filter(p => p.price > cur.price && p.perf > (cur.perf || 0) && p.price <= cur.price * 1.6).sort((a,b) => a.price - b.price)[0];
    if (!nextTier) return null;
    return { cat: tCat(c), curName: cur.name, nextName: nextTier.name, curPrice: cur.price, nextPrice: nextTier.price, diff: nextTier.price - cur.price, perfGain: nextTier.perf - (cur.perf||0) };
  }).filter(Boolean) : [];

  // 17 — resale estimate (3-year retention rates)
  const retention = { cpu:0.50, gpu:0.45, ram:0.35, storage:0.30, mobo:0.30, psu:0.60, case:0.55, cooler:0.50 };
  const resale = parts ? CATEGORY_ORDER.filter(c => parts[c]).map(c => ({
    cat: tCat(c), cost: parts[c].price, est: Math.round(parts[c].price * (retention[c]||0.4)),
  })) : [];
  const resaleTotal = resale.reduce((s,r) => s+r.est, 0);

  // 18 — used vs new
  const usedSavings = total > 0 ? Math.round(total * 0.25) : 0;
  const usedBestParts = parts ? CATEGORY_ORDER.filter(c => parts[c] && ["gpu","cpu","ram"].includes(c)).map(c => ({
    cat: tCat(c), saving: Math.round((parts[c].price||0)*0.28),
  })) : [];

  // 19 — payment plan
  const monthlyPayment = (total, months, apr) => {
    if (apr === 0) return (total / months).toFixed(2);
    const r = apr / 100 / 12;
    return (total * r / (1 - Math.pow(1+r, -months))).toFixed(2);
  };
  const pmtOptions = [6, 12, 24, 36];
  const totalWithInterest = payInterest > 0
    ? (parseFloat(monthlyPayment(total, payMonths, payInterest)) * payMonths).toFixed(2)
    : total.toFixed(2);

  // 28 — shopping list
  const shoppingList = parts ? CATEGORY_ORDER.filter(c => parts[c]).map(c =>
    `${tCat(c)}: ${parts[c].name} — $${parts[c].price}`
  ).join("\n") + `\n\nTotal: $${total}` : "";

  const copyList = () => {
    navigator.clipboard.writeText(shoppingList).then(() => {
      setListCopied(true);
      setTimeout(() => setListCopied(false), 2000);
    });
  };

  const amazonSearch = (name) => `https://www.amazon.com/s?k=${encodeURIComponent(name)}`;
  const neweggSearch = (name) => `https://www.newegg.com/p/pl?d=${encodeURIComponent(name)}`;

  return (
    <div className="rf-fade rf-community">
      <div className="rf-section-head" style={{marginBottom:"1.5rem"}}>
        <div>
          <h2 style={{margin:0}}>💰 Cost Tools</h2>
          <p className="rf-muted" style={{marginTop:"0.3rem",fontSize:"0.85rem"}}>Budget breakdown, lifespan, resale, payment plans & shopping</p>
        </div>
        <button className="rf-ghost" onClick={handleBack}><ChevronLeft size={15}/> Back</button>
      </div>

      {!parts && <NoBuildPicker saved={saved} onPick={setLocalBuild} />}

      {parts && (
        <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>

          {/* 14 — Budget Breakdown */}
          <div className="rf-pe-card">
            <div className="rf-analyze-title">📊 Budget Breakdown</div>
            <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
              {breakdown.map((b,i) => (
                <div key={b.cat}>
                  <div className="rf-analyze-row" style={{marginBottom:"3px"}}>
                    <span style={{fontSize:"0.84rem"}}>{b.cat}</span>
                    <span style={{fontSize:"0.84rem",fontWeight:600}}>${b.price} <span className="rf-muted">({b.pct}%)</span></span>
                  </div>
                  <div style={{height:"8px",borderRadius:"4px",background:"var(--c-panel-2)",overflow:"hidden"}}>
                    <div style={{height:"100%",width:b.pct+"%",borderRadius:"4px",background:COLORS[i%COLORS.length],transition:"width .4s var(--ease)"}}/>
                  </div>
                </div>
              ))}
            </div>
            <div className="rf-analyze-row" style={{marginTop:"12px",borderTop:"1px solid var(--c-border)",paddingTop:"8px"}}>
              <span style={{fontWeight:700}}>Total</span>
              <span style={{fontWeight:700,color:"var(--c-accent)"}}>${total}</span>
            </div>
          </div>

          {/* 15 — Part Lifespan Value */}
          <div className="rf-pe-card">
            <div className="rf-analyze-title">⏳ Lifespan Value (cost per day)</div>
            {lifespan ? (
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px"}}>
                {[["3 Years",lifespan.yr3],["5 Years",lifespan.yr5],["7 Years",lifespan.yr7]].map(([label,val])=>(
                  <div key={label} style={{textAlign:"center",padding:"12px",borderRadius:"10px",background:"rgba(255,255,255,0.04)"}}>
                    <div style={{fontSize:"1.3rem",fontWeight:700,color:"var(--c-accent)",fontFamily:"'JetBrains Mono'"}}>${val}</div>
                    <div style={{fontSize:"0.72rem",color:"var(--c-muted)",marginTop:"3px"}}>per day over {label}</div>
                  </div>
                ))}
              </div>
            ) : <p className="rf-muted">No parts selected</p>}
            <p className="rf-muted" style={{fontSize:"0.75rem",marginTop:"8px"}}>Based on a total build cost of ${total}. Excludes electricity and maintenance.</p>
          </div>

          {/* 16 — Upgrade Cost Advisor */}
          <div className="rf-pe-card">
            <div className="rf-analyze-title">🔼 Upgrade Cost Advisor</div>
            {upgradeTips.length === 0
              ? <p className="rf-muted" style={{fontSize:"0.85rem"}}>You're at or near the top tier in each category.</p>
              : upgradeTips.slice(0,4).map(u => (
                <div key={u.cat} style={{padding:"8px 0",borderBottom:"1px solid var(--c-border)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"2px"}}>
                    <span style={{fontSize:"0.83rem",fontWeight:600}}>{u.cat}</span>
                    <span style={{fontSize:"0.83rem",color:"var(--c-warn)"}}>+${u.diff} for +{u.perfGain} perf pts</span>
                  </div>
                  <div style={{fontSize:"0.77rem",color:"var(--c-muted)"}}>{u.curName} → {u.nextName}</div>
                </div>
              ))
            }
          </div>

          {/* 17 — Resale Value Estimator */}
          <div className="rf-pe-card">
            <div className="rf-analyze-title">📉 Resale Value (3-Year Estimate)</div>
            <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
              {resale.map(r => (
                <div key={r.cat} className="rf-analyze-row">
                  <span style={{fontSize:"0.83rem"}}>{r.cat}</span>
                  <span style={{fontSize:"0.83rem"}}><span className="rf-muted">${r.cost}</span> → <span style={{color:"var(--c-good)"}}>${r.est}</span></span>
                </div>
              ))}
            </div>
            <div className="rf-analyze-row" style={{marginTop:"10px",borderTop:"1px solid var(--c-border)",paddingTop:"8px"}}>
              <span style={{fontWeight:600}}>Estimated resale total</span>
              <span style={{fontWeight:700,color:"var(--c-good)"}}>${resaleTotal} <span className="rf-muted" style={{fontWeight:400}}>({Math.round((resaleTotal/total)*100)}% retained)</span></span>
            </div>
          </div>

          {/* 18 — Used vs New */}
          <div className="rf-pe-card">
            <div className="rf-analyze-title">🛒 Used vs New Savings</div>
            <div style={{display:"flex",gap:"12px",marginBottom:"12px"}}>
              <div style={{flex:1,padding:"12px",borderRadius:"10px",background:"rgba(255,255,255,0.04)",textAlign:"center"}}>
                <div style={{fontSize:"0.75rem",color:"var(--c-muted)",marginBottom:"4px"}}>New build</div>
                <div style={{fontSize:"1.3rem",fontWeight:700}}>${total}</div>
              </div>
              <div style={{flex:1,padding:"12px",borderRadius:"10px",background:"rgba(70,224,160,0.08)",border:"1px solid rgba(70,224,160,0.2)",textAlign:"center"}}>
                <div style={{fontSize:"0.75rem",color:"var(--c-muted)",marginBottom:"4px"}}>Used estimate</div>
                <div style={{fontSize:"1.3rem",fontWeight:700,color:"var(--c-good)"}}>${total - usedSavings}</div>
              </div>
            </div>
            <p style={{fontSize:"0.83rem",color:"var(--c-muted)",margin:"0 0 8px"}}>Buying used saves roughly <strong style={{color:"var(--c-good)"}}>${usedSavings}</strong> (~25%). Best used deals:</p>
            {usedBestParts.map(p => (
              <div key={p.cat} className="rf-analyze-row">
                <span style={{fontSize:"0.82rem"}}>{p.cat}</span>
                <span style={{fontSize:"0.82rem",color:"var(--c-good)"}}>~${p.saving} savings</span>
              </div>
            ))}
            <p className="rf-muted" style={{fontSize:"0.75rem",marginTop:"8px"}}>Check eBay, Facebook Marketplace, r/hardwareswap for used prices.</p>
          </div>

          {/* 19 — Payment Plan Builder */}
          <div className="rf-pe-card">
            <div className="rf-analyze-title">💳 Payment Plan Builder</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
              <div>
                <div style={{fontSize:"0.75rem",color:"var(--c-muted)",marginBottom:"5px"}}>Term</div>
                <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
                  {pmtOptions.map(m => (
                    <button key={m} className={"rf-pill"+(payMonths===m?" active":"")} onClick={()=>setPayMonths(m)}>{m}mo</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:"0.75rem",color:"var(--c-muted)",marginBottom:"5px"}}>APR %</div>
                <input className="rf-input" type="number" min={0} max={30} step={0.5} value={payInterest}
                  onChange={e=>setPayInterest(parseFloat(e.target.value)||0)}
                  style={{padding:"6px 10px",fontSize:"0.85rem",width:"100%"}} />
              </div>
            </div>
            <div style={{display:"flex",gap:"12px"}}>
              <div style={{flex:1,padding:"12px",borderRadius:"10px",background:"rgba(25,232,219,0.07)",border:"1px solid rgba(25,232,219,0.2)",textAlign:"center"}}>
                <div style={{fontSize:"0.72rem",color:"var(--c-muted)",marginBottom:"4px"}}>Monthly payment</div>
                <div style={{fontSize:"1.6rem",fontWeight:700,color:"var(--c-accent)",fontFamily:"'JetBrains Mono'"}}>${monthlyPayment(total,payMonths,payInterest)}</div>
              </div>
              {payInterest > 0 && (
                <div style={{flex:1,padding:"12px",borderRadius:"10px",background:"rgba(255,92,114,0.07)",textAlign:"center"}}>
                  <div style={{fontSize:"0.72rem",color:"var(--c-muted)",marginBottom:"4px"}}>Total with interest</div>
                  <div style={{fontSize:"1.3rem",fontWeight:700,color:"var(--c-bad)"}}>${totalWithInterest}</div>
                </div>
              )}
            </div>
          </div>

          {/* C12 — Monthly Savings Planner */}
          <div className="rf-pe-card">
            <div className="rf-analyze-title">🗓️ Monthly Savings Planner</div>
            <div style={{marginBottom:"10px"}}>
              <div style={{fontSize:"0.75rem",color:"var(--c-muted)",marginBottom:"5px"}}>Monthly savings: {fmt(monthlySavings)}</div>
              <input type="range" min={50} max={1000} step={25} value={monthlySavings} onChange={e=>setMonthlySavings(+e.target.value)} className="pm-range" style={{width:"100%"}} />
            </div>
            {monthsToSave && (
              <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
                <div style={{flex:1,padding:"12px",borderRadius:"10px",background:"rgba(25,232,219,0.07)",border:"1px solid rgba(25,232,219,0.2)",textAlign:"center"}}>
                  <div style={{fontSize:"0.72rem",color:"var(--c-muted)",marginBottom:"4px"}}>Months to save</div>
                  <div style={{fontSize:"2rem",fontWeight:700,color:"var(--c-accent)",fontFamily:"'JetBrains Mono'"}}>{monthsToSave}</div>
                </div>
                <div style={{flex:1,padding:"12px",borderRadius:"10px",background:"rgba(124,92,255,0.07)",border:"1px solid rgba(124,92,255,0.2)",textAlign:"center"}}>
                  <div style={{fontSize:"0.72rem",color:"var(--c-muted)",marginBottom:"4px"}}>Target total</div>
                  <div style={{fontSize:"1.6rem",fontWeight:700,color:"var(--c-accent2)"}}>{fmt(total)}</div>
                </div>
              </div>
            )}
          </div>

          {/* C12 — Cashback & Tax Calculator */}
          <div className="rf-pe-card">
            <div className="rf-analyze-title">💸 Cashback &amp; Tax Calculator</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
              <div>
                <div style={{fontSize:"0.75rem",color:"var(--c-muted)",marginBottom:"5px"}}>Cashback %: {cashbackPct}%</div>
                <input type="range" min={0} max={10} step={0.5} value={cashbackPct} onChange={e=>setCashbackPct(+e.target.value)} className="pm-range" style={{width:"100%"}} />
              </div>
              <div>
                <div style={{fontSize:"0.75rem",color:"var(--c-muted)",marginBottom:"5px"}}>Sales tax %: {taxRate}%</div>
                <input type="range" min={0} max={15} step={0.5} value={taxRate} onChange={e=>setTaxRate(+e.target.value)} className="pm-range" style={{width:"100%"}} />
              </div>
            </div>
            <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
              <div style={{flex:1,padding:"10px",borderRadius:"10px",background:"rgba(70,224,160,0.08)",border:"1px solid rgba(70,224,160,0.2)",textAlign:"center"}}>
                <div style={{fontSize:"0.72rem",color:"var(--c-muted)",marginBottom:"4px"}}>Cashback earned</div>
                <div style={{fontSize:"1.5rem",fontWeight:700,color:"var(--c-good)",fontFamily:"'JetBrains Mono'"}}>${cashbackAmt}</div>
              </div>
              <div style={{flex:1,padding:"10px",borderRadius:"10px",background:"rgba(255,194,75,0.07)",border:"1px solid rgba(255,194,75,0.2)",textAlign:"center"}}>
                <div style={{fontSize:"0.72rem",color:"var(--c-muted)",marginBottom:"4px"}}>Tax ({taxRate}%)</div>
                <div style={{fontSize:"1.5rem",fontWeight:700,color:"var(--c-warn)",fontFamily:"'JetBrains Mono'"}}>${taxAmt}</div>
              </div>
              <div style={{flex:1,padding:"10px",borderRadius:"10px",background:"rgba(255,255,255,0.04)",border:"1px solid var(--c-border)",textAlign:"center"}}>
                <div style={{fontSize:"0.72rem",color:"var(--c-muted)",marginBottom:"4px"}}>Total (with tax)</div>
                <div style={{fontSize:"1.5rem",fontWeight:700,fontFamily:"'JetBrains Mono'"}}>${totalWithTax}</div>
              </div>
            </div>
            <div className="rf-analyze-row" style={{marginTop:"10px",paddingTop:"8px",borderTop:"1px solid var(--c-border)"}}>
              <span style={{fontWeight:700}}>Net after cashback + tax</span>
              <span style={{fontWeight:700,color:"var(--c-accent)"}}>${(parseFloat(totalWithTax) - parseFloat(cashbackAmt)).toFixed(2)}</span>
            </div>
          </div>

          {/* 23 — Seasonal Sale Tips */}
          <div className="rf-pe-card">
            <div className="rf-analyze-title">📅 Best Times to Buy</div>
            <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
              {SALE_DATES.map((s,i) => (
                <div key={i} style={{padding:"8px 10px",borderRadius:"8px",background:"rgba(255,255,255,0.03)",border:"1px solid var(--c-border)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"2px"}}>
                    <span style={{fontWeight:600,fontSize:"0.84rem"}}>{s.name}</span>
                    <span style={{fontSize:"0.78rem",color:"var(--c-accent)",fontFamily:"'JetBrains Mono'"}}>{s.date}</span>
                  </div>
                  <div style={{fontSize:"0.77rem",color:"var(--c-muted)"}}>{s.tip}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 27/28 — Shopping List */}
          <div className="rf-pe-card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
              <div className="rf-analyze-title" style={{margin:0}}>🛍️ Shopping List</div>
              <div style={{display:"flex",gap:"8px"}}>
                <button className="rf-ghost rf-sm-btn" onClick={copyList}>{listCopied ? <><Check size={12}/> Copied!</> : <><PackageSearch size={12}/> Copy list</>}</button>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
              {CATEGORY_ORDER.filter(c => parts[c]).map(c => (
                <div key={c} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 8px",borderRadius:"8px",background:"rgba(255,255,255,0.03)"}}>
                  <div>
                    <div style={{fontSize:"0.78rem",color:"var(--c-muted)"}}>{tCat(c)}</div>
                    <div style={{fontSize:"0.84rem"}}>{parts[c].name}</div>
                  </div>
                  <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
                    <span style={{fontWeight:600,fontSize:"0.84rem"}}>${parts[c].price}</span>
                    <a href={amazonSearch(parts[c].name)} target="_blank" rel="noopener noreferrer" style={{fontSize:"0.72rem",color:"var(--c-accent)",border:"1px solid rgba(25,232,219,0.3)",borderRadius:"6px",padding:"2px 7px",textDecoration:"none"}}>Amazon</a>
                    <a href={neweggSearch(parts[c].name)} target="_blank" rel="noopener noreferrer" style={{fontSize:"0.72rem",color:"var(--c-accent2)",border:"1px solid rgba(124,92,255,0.3)",borderRadius:"6px",padding:"2px 7px",textDecoration:"none"}}>Newegg</a>
                  </div>
                </div>
              ))}
            </div>
            <div className="rf-analyze-row" style={{marginTop:"10px",borderTop:"1px solid var(--c-border)",paddingTop:"8px"}}>
              <span style={{fontWeight:700}}>Build Total</span>
              <span style={{fontWeight:700,color:"var(--c-accent)"}}>${total}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

/* ---- FPS & Games view ---- */
function FpsGamesView({ parts: propParts, onBack, saved }) {
  const [localBuild, setLocalBuild] = useState(null);
  const parts = localBuild ? localBuild.parts : propParts;
  const handleBack = () => { if (localBuild) { setLocalBuild(null); return; } onBack(); };
  const [tab, setTab] = useState("fps");
  const gpuPerf = parts?.gpu?.perf || 0;
  const cores = parts?.cpu?.cores || 0;
  const ram = parts?.ram?.cap || 0;
  const vram = parts?.gpu?.vram || 0;
  const gameCheck = (spec) => {
    const meetsMin = cores >= spec.minCores && ram >= spec.minRam && vram >= spec.minVram;
    const meetsRec = cores >= spec.recCores && ram >= spec.recRam && vram >= spec.recVram;
    return meetsRec ? "recommended" : meetsMin ? "minimum" : "below";
  };
  return (
    <div className="rf-fade rf-community">
      <div className="rf-section-head" style={{marginBottom:"1.2rem"}}>
        <div><h2 style={{margin:0}}>🎮 FPS & Game Checker</h2><p className="rf-muted" style={{marginTop:"0.3rem",fontSize:"0.85rem"}}>Estimated FPS and game compatibility for your build</p></div>
        <button className="rf-ghost" onClick={handleBack}><ChevronLeft size={15}/> Back</button>
      </div>
      {!parts && <NoBuildPicker saved={saved} onPick={setLocalBuild} />}
      {parts && <>
      <div className="rf-community-filters" style={{marginBottom:"1rem"}}>
        {["fps","games"].map(t=><button key={t} className={"rf-pill"+(tab===t?" active":"")} onClick={()=>setTab(t)}>{t==="fps"?"⚡ FPS Estimator":"✅ Game Checker"}</button>)}
      </div>
      {!parts.gpu && <p className="rf-muted">Add a GPU to see estimates.</p>}
      {parts?.gpu && tab === "fps" && (
        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr repeat(3,1fr)",gap:"0",background:"var(--c-panel)",borderRadius:"10px",overflow:"hidden",fontSize:"0.78rem",fontWeight:700,color:"var(--c-muted)",border:"1px solid var(--c-border)"}}>
            {["Game","1080p","1440p","4K"].map(h=><div key={h} style={{padding:"8px 10px",borderBottom:"1px solid var(--c-border)"}}>{h}</div>)}
            {FPS_GAMES.map(g=>{
              const f1=fpsEstimate(gpuPerf,g.demand,1), f2=fpsEstimate(gpuPerf,g.demand,2), f4=fpsEstimate(gpuPerf,g.demand,4);
              const col=fps=>fps>=144?"var(--c-good)":fps>=60?"var(--c-accent)":fps>=30?"var(--c-warn)":"var(--c-bad)";
              return [
                <div key={g.name+"n"} style={{padding:"8px 10px",fontSize:"0.84rem",display:"flex",gap:"6px",alignItems:"center"}}><span>{g.icon}</span>{g.name}</div>,
                ...[f1,f2,f4].map((f,i)=><div key={g.name+i} style={{padding:"8px 10px",fontWeight:700,color:col(f),fontFamily:"'JetBrains Mono'"}}>{f}</div>)
              ];
            })}
          </div>
          <p className="rf-muted" style={{fontSize:"0.75rem"}}>Estimates based on GPU perf score. Actual FPS varies by driver, settings, and CPU pairing.</p>
        </div>
      )}
      {parts?.gpu && tab === "games" && (
        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          {GAME_SPECS.map(spec=>{
            const status=gameCheck(spec);
            const color=status==="recommended"?"var(--c-good)":status==="minimum"?"var(--c-warn)":"var(--c-bad)";
            const label=status==="recommended"?"✓ Recommended":"minimum"?"⚠ Minimum only":"✗ Below minimum";
            return (
              <div key={spec.name} style={{padding:"10px 12px",borderRadius:"10px",background:"var(--c-panel)",border:`1px solid ${color}33`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:600,fontSize:"0.86rem"}}>{spec.name}</div>
                  <div style={{fontSize:"0.76rem",color:"var(--c-muted)",marginTop:"2px"}}>Min: {spec.minCores}c / {spec.minRam}GB / {spec.minVram}GB VRAM · Rec: {spec.recCores}c / {spec.recRam}GB / {spec.recVram}GB</div>
                </div>
                <span style={{fontSize:"0.78rem",fontWeight:700,color,whiteSpace:"nowrap",marginLeft:"12px"}}>{label}</span>
              </div>
            );
          })}
        </div>
      )}
      </>}
    </div>
  );
}

/* ---- Build Stats view ---- */
function BuildStatsView({ parts: propParts, analysis: propAnalysis, useCase: propUseCase, onBack, saved }) {
  const [localBuild, setLocalBuild] = useState(null);
  const parts = localBuild ? localBuild.parts : propParts;
  const useCase = localBuild ? localBuild.useCase : propUseCase;
  const analysis = useMemo(() => localBuild ? analyzeBuild(localBuild.parts, localBuild.useCase, localBuild.budget) : propAnalysis, [localBuild, propAnalysis]);
  const handleBack = () => { if (localBuild) { setLocalBuild(null); return; } onBack(); };
  const [tab, setTab] = useState("card");
  const tier = analysis ? buildTierRating(analysis) : null;
  const card = parts && analysis ? buildReportCard(parts, analysis, useCase) : null;
  const tips = parts && analysis ? smartTips(parts, analysis, useCase) : [];
  return (
    <div className="rf-fade rf-community">
      <div className="rf-section-head" style={{marginBottom:"1.2rem"}}>
        <div><h2 style={{margin:0}}>🏆 Build Stats</h2><p className="rf-muted" style={{marginTop:"0.3rem",fontSize:"0.85rem"}}>Tier rating, component grades and smart tips</p></div>
        <button className="rf-ghost" onClick={handleBack}><ChevronLeft size={15}/> Back</button>
      </div>
      {(!parts||!analysis) && <NoBuildPicker saved={saved} onPick={setLocalBuild} />}
      {parts && analysis && <>
        <div className="rf-community-filters" style={{marginBottom:"1rem"}}>
          {["card","tier","tips"].map(t=><button key={t} className={"rf-pill"+(tab===t?" active":"")} onClick={()=>setTab(t)}>{t==="card"?"📊 Report Card":t==="tier"?"🏆 Build Tier":"💡 Smart Tips"}</button>)}
        </div>
        {tab==="card" && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"10px"}}>
            {CATEGORY_ORDER.filter(c=>parts[c]).map(c=>{
              const g=card[c]; const M=CAT_META[c];
              return (
                <div key={c} style={{padding:"14px",borderRadius:"12px",background:"var(--c-panel)",border:`2px solid ${g.color}44`,textAlign:"center"}}>
                  <M.Icon size={20} style={{color:g.color,marginBottom:"6px"}} />
                  <div style={{fontSize:"0.76rem",color:"var(--c-muted)",marginBottom:"4px"}}>{tCat(c)}</div>
                  <div style={{fontSize:"2.5rem",fontWeight:800,color:g.color,fontFamily:"'Chakra Petch',sans-serif",lineHeight:1}}>{g.grade}</div>
                  <div style={{fontSize:"0.72rem",color:"var(--c-muted)",marginTop:"4px"}}>{g.score}/100</div>
                </div>
              );
            })}
          </div>
        )}
        {tab==="tier" && tier && (
          <div style={{textAlign:"center",padding:"40px 20px"}}>
            <div style={{fontSize:"6rem",fontWeight:900,color:tier.color,fontFamily:"'Chakra Petch',sans-serif",lineHeight:1,textShadow:`0 0 60px ${tier.color}66`}}>{tier.tier}</div>
            <div style={{fontSize:"1.4rem",fontWeight:700,color:tier.color,marginTop:"8px"}}>{tier.label}</div>
            <p style={{color:"var(--c-muted)",marginTop:"8px",fontSize:"0.9rem"}}>{tier.desc}</p>
            <div style={{marginTop:"20px",display:"inline-flex",gap:"6px",flexWrap:"wrap",justifyContent:"center"}}>
              {["D","C","B","A","S","S+"].map(t=><span key={t} style={{padding:"6px 14px",borderRadius:"999px",border:`2px solid ${tier.tier===t?tier.color:"var(--c-border)"}`,fontWeight:700,fontSize:"0.9rem",color:tier.tier===t?tier.color:"var(--c-muted)",fontFamily:"'Chakra Petch'"}}>{t}</span>)}
            </div>
            <div style={{marginTop:"24px",padding:"12px 16px",borderRadius:"10px",background:"var(--c-panel)",display:"inline-block"}}>
              <span className="rf-muted" style={{fontSize:"0.84rem"}}>Performance score: </span>
              <span style={{fontWeight:700,color:"var(--c-accent)"}}>{analysis.score} / 1000</span>
            </div>
          </div>
        )}
        {tab==="tips" && (
          <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {tips.map((tip,i)=>(
              <div key={i} style={{display:"flex",gap:"12px",alignItems:"flex-start",padding:"12px 14px",borderRadius:"10px",background:"var(--c-panel)",border:"1px solid var(--c-border)"}}>
                <span style={{fontSize:"1.2rem",lineHeight:1,paddingTop:"1px"}}>{tip.icon}</span>
                <span style={{fontSize:"0.86rem",lineHeight:1.5}}>{tip.text}</span>
              </div>
            ))}
          </div>
        )}
      </>}
    </div>
  );
}

/* ---- Power & Peripherals view ---- */
function PowerPeripheralsView({ parts: propParts, useCase: propUseCase, onBack, saved }) {
  const [localBuild, setLocalBuild] = useState(null);
  const parts = localBuild ? localBuild.parts : propParts;
  const useCase = localBuild ? localBuild.useCase : propUseCase;
  const handleBack = () => { if (localBuild) { setLocalBuild(null); return; } onBack(); };
  const [tab, setTab] = useState("power");
  const pw = parts ? powerBreakdown(parts) : { items:[], total:0 };
  const ucKey = (USE_CASES[useCase] ? useCase : null) || "gaming";
  const perifs = PERIPHERAL_SETS[ucKey] || PERIPHERAL_SETS.gaming;
  return (
    <div className="rf-fade rf-community">
      <div className="rf-section-head" style={{marginBottom:"1.2rem"}}>
        <div><h2 style={{margin:0}}>🔋 Power & Peripherals</h2><p className="rf-muted" style={{marginTop:"0.3rem",fontSize:"0.85rem"}}>Component wattage breakdown and peripheral suggestions</p></div>
        <button className="rf-ghost" onClick={handleBack}><ChevronLeft size={15}/> Back</button>
      </div>
      <div className="rf-community-filters" style={{marginBottom:"1rem"}}>
        {["power","peripherals"].map(t=><button key={t} className={"rf-pill"+(tab===t?" active":"")} onClick={()=>setTab(t)}>{t==="power"?"🔋 Power Breakdown":"🖱️ Peripherals"}</button>)}
      </div>
      {tab==="power" && (
        !parts ? <NoBuildPicker saved={saved} onPick={setLocalBuild} /> :
        <div className="rf-pe-card" style={{maxWidth:"520px"}}>
          {pw.items.map(item=>{
            const pct=Math.round((item.watts/pw.total)*100);
            const col=item.label==="CPU"||item.label==="GPU"?"var(--c-accent)":"var(--c-muted)";
            return (
              <div key={item.label} style={{marginBottom:"10px"}}>
                <div className="rf-analyze-row" style={{marginBottom:"4px"}}>
                  <span style={{fontSize:"0.84rem"}}>{item.label}</span>
                  <span style={{fontSize:"0.84rem",fontWeight:600,color:col}}>{item.watts}W <span className="rf-muted">({pct}%)</span></span>
                </div>
                <div style={{height:"8px",borderRadius:"4px",background:"var(--c-panel-2)",overflow:"hidden"}}>
                  <div style={{height:"100%",width:pct+"%",background:col,borderRadius:"4px",transition:"width .4s var(--ease)"}}/>
                </div>
              </div>
            );
          })}
          <div className="rf-analyze-row" style={{marginTop:"12px",borderTop:"1px solid var(--c-border)",paddingTop:"10px"}}>
            <span style={{fontWeight:700}}>Estimated Total</span>
            <span style={{fontWeight:700,color:"var(--c-accent)"}}>{pw.total}W</span>
          </div>
          {parts.psu && <p className="rf-muted" style={{fontSize:"0.76rem",marginTop:"6px"}}>PSU rated: {parts.psu.watt}W · Headroom: {parts.psu.watt-pw.total}W ({Math.round(((parts.psu.watt-pw.total)/parts.psu.watt)*100)}%)</p>}
        </div>
      )}
      {tab==="peripherals" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"12px"}}>
          {[["🖥️ Monitor",perifs.monitor],["🖱️ Mouse",perifs.mouse],["⌨️ Keyboard",perifs.kb]].map(([label,items])=>(
            <div key={label} className="rf-pe-card">
              <div className="rf-analyze-title">{label}</div>
              {items.map((item,i)=>(
                <div key={i} style={{padding:"7px 0",borderBottom:"1px solid var(--c-border)",fontSize:"0.84rem",display:"flex",gap:"8px",alignItems:"center"}}>
                  <span style={{color:"var(--c-accent)",fontSize:"0.72rem",minWidth:"14px"}}>{i===0?"🥇":i===1?"🥈":"🥉"}</span>{item}
                </div>
              ))}
              <p className="rf-muted" style={{fontSize:"0.74rem",marginTop:"8px"}}>Optimised for {USE_CASES[ucKey]?.label || "your use case"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- Export & More view ---- */
function ExportMoreView({ parts: propParts, analysis: propAnalysis, useCase: propUseCase, budget: propBudget, onBack, saved }) {
  const [localBuild, setLocalBuild] = useState(null);
  const parts = localBuild ? localBuild.parts : propParts;
  const useCase = localBuild ? localBuild.useCase : propUseCase;
  const budget = localBuild ? localBuild.budget : propBudget;
  const analysis = useMemo(() => localBuild ? analyzeBuild(localBuild.parts, localBuild.useCase, localBuild.budget) : propAnalysis, [localBuild, propAnalysis]);
  const handleBack = () => { if (localBuild) { setLocalBuild(null); return; } onBack(); };
  const [tab, setTab] = useState("export");
  const [copied, setCopied] = useState(false);
  const total = parts ? CATEGORY_ORDER.reduce((s,c)=>s+(parts[c]?.price||0),0) : 0;

  const buildText = parts ? [
    `FORGEAPC Build — ${USE_CASES[useCase]?.label || useCase} · $${budget} budget`,
    `Generated: ${new Date().toLocaleDateString()}`,
    "─".repeat(50),
    ...CATEGORY_ORDER.filter(c=>parts[c]).map(c=>`${tCat(c).padEnd(16)} ${parts[c].name} — $${parts[c].price}`),
    "─".repeat(50),
    `TOTAL: $${total}`,
    parts.cpu ? `Performance score: ${analysis?.score || "—"}/1000` : "",
  ].filter(Boolean).join("\n") : "";

  const downloadTxt = () => {
    const blob = new Blob([buildText], { type:"text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `forgeapc-build-${useCase}-$${budget}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadJson = () => {
    const obj = { useCase, budget, total, parts, score: analysis?.score };
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type:"application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `forgeapc-build-${useCase}-$${budget}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const copyText = () => { navigator.clipboard.writeText(buildText).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); }); };

  const tier = analysis ? buildTierRating(analysis) : null;

  return (
    <div className="rf-fade rf-community">
      <div className="rf-section-head" style={{marginBottom:"1.2rem"}}>
        <div><h2 style={{margin:0}}>📁 Export & More</h2><p className="rf-muted" style={{marginTop:"0.3rem",fontSize:"0.85rem"}}>Export your build, compare eras, view summary card</p></div>
        <button className="rf-ghost" onClick={handleBack}><ChevronLeft size={15}/> Back</button>
      </div>
      <div className="rf-community-filters" style={{marginBottom:"1rem"}}>
        {["export","era","summary"].map(t=><button key={t} className={"rf-pill"+(tab===t?" active":"")} onClick={()=>setTab(t)}>{t==="export"?"📁 Export":t==="era"?"📈 Era Compare":"🎯 Summary Card"}</button>)}
      </div>

      {tab==="export" && (
        !parts ? <NoBuildPicker saved={saved} onPick={setLocalBuild} /> :
        <div style={{display:"flex",flexDirection:"column",gap:"12px",maxWidth:"520px"}}>
          <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
            <button className="rf-btn" onClick={downloadTxt}><Save size={15}/> Download .txt</button>
            <button className="rf-forge-btn outline" onClick={downloadJson}><Save size={15}/> Download .json</button>
            <button className="rf-ghost" onClick={copyText}>{copied?<><Check size={13}/> Copied!</>:<><PackageSearch size={13}/> Copy to clipboard</>}</button>
          </div>
          <pre style={{background:"var(--c-panel)",border:"1px solid var(--c-border)",borderRadius:"10px",padding:"14px",fontSize:"0.76rem",color:"var(--c-muted)",overflowX:"auto",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{buildText}</pre>
        </div>
      )}

      {tab==="era" && (
        <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
          {ERA_BUILDS.map((era,i)=>{
            const isCurrent = era.year === "2026";
            return (
              <div key={era.year} style={{padding:"16px",borderRadius:"12px",background:"var(--c-panel)",border:`2px solid ${isCurrent?"var(--c-accent)":"var(--c-border)"}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                  <span style={{fontWeight:700,fontSize:"1rem",fontFamily:"'Chakra Petch'"}}>{era.year} {isCurrent&&<span style={{color:"var(--c-accent)",fontSize:"0.8rem"}}>(Now)</span>}</span>
                  <span style={{fontSize:"0.82rem",color:"var(--c-muted)"}}>{era.note}</span>
                </div>
                <div style={{fontSize:"0.84rem",marginBottom:"10px",color:"var(--c-muted)"}}>{era.desc}</div>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <div style={{flex:1,height:"10px",borderRadius:"5px",background:"var(--c-panel-2)",overflow:"hidden"}}>
                    <div style={{height:"100%",width:era.score+"%",background:isCurrent?"var(--c-accent)":"var(--c-accent2)",borderRadius:"5px"}}/>
                  </div>
                  <span style={{fontWeight:700,fontSize:"0.9rem",color:isCurrent?"var(--c-accent)":"var(--c-accent2)",minWidth:"50px",textAlign:"right"}}>{era.score}/100</span>
                </div>
              </div>
            );
          })}
          <p className="rf-muted" style={{fontSize:"0.76rem"}}>All builds at ~$2,000. Shows how far PC performance has come over 4 years.</p>
        </div>
      )}

      {tab==="summary" && (
        !parts ? <NoBuildPicker saved={saved} onPick={setLocalBuild} /> :
        <div style={{maxWidth:"480px",padding:"24px",borderRadius:"14px",background:"linear-gradient(135deg,rgba(25,232,219,0.06),rgba(124,92,255,0.06))",border:"2px solid var(--c-accent)",fontFamily:"'Chakra Petch',sans-serif"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"16px"}}>
            <div>
              <div style={{fontSize:"1.1rem",fontWeight:700,color:"var(--c-accent)"}}>FORGEAPC</div>
              <div style={{fontSize:"0.75rem",color:"var(--c-muted)"}}>{USE_CASES[useCase]?.label} · ${budget} budget</div>
            </div>
            {tier && <div style={{fontSize:"2rem",fontWeight:900,color:tier.color,lineHeight:1}}>{tier.tier}</div>}
          </div>
          {CATEGORY_ORDER.filter(c=>parts[c]).map(c=>(
            <div key={c} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",fontSize:"0.8rem"}}>
              <span style={{color:"var(--c-muted)"}}>{tCat(c)}</span>
              <span>{parts[c].name} <span style={{color:"var(--c-muted)"}}>· ${parts[c].price}</span></span>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",marginTop:"12px",paddingTop:"10px",borderTop:"1px solid var(--c-accent)44"}}>
            <span style={{fontWeight:700}}>Total</span>
            <span style={{fontWeight:700,color:"var(--c-accent)"}}>${total}</span>
          </div>
          {analysis && <div style={{marginTop:"10px",display:"flex",gap:"12px",fontSize:"0.78rem",color:"var(--c-muted)"}}>
            <span>Perf: <strong style={{color:"var(--c-text)"}}>{analysis.score}</strong></span>
            <span>P/P: <strong style={{color:"var(--c-text)"}}>{analysis.ppScore}</strong></span>
          </div>}
        </div>
      )}
    </div>
  );
}

function noiseEstimate(parts) {
  if (!parts || !parts.cooler) return null;
  const coolerName = (parts.cooler.name || "").toLowerCase();
  const isAio = coolerName.includes("aio") || coolerName.includes("liquid") || coolerName.includes("240") || coolerName.includes("360");
  const isPassive = coolerName.includes("passive") || coolerName.includes("fanless");
  const gpuName = (parts.gpu ? parts.gpu.name || "" : "").toLowerCase();
  const isZeroFan = gpuName.includes("zero-fan") || gpuName.includes("silent");
  let dbEst = isPassive ? 22 : isAio ? 32 : 38;
  if (!isZeroFan && parts.gpu) dbEst += 4;
  const label = dbEst < 28 ? "Near-silent" : dbEst < 35 ? "Quiet" : dbEst < 42 ? "Moderate" : "Loud";
  const color = dbEst < 28 ? "var(--c-good)" : dbEst < 35 ? "var(--c-accent)" : dbEst < 42 ? "var(--c-warn)" : "var(--c-bad)";
  return { dbEst, label, color, isAio, isPassive };
}
function weightEstimate(parts) {
  const weights = { cpu: 0.1, gpu: parts && parts.gpu ? (parts.gpu.vram >= 16 ? 1.8 : parts.gpu.vram >= 8 ? 1.3 : 0.9) : 0, mobo: 0.8, ram: 0.08, storage: 0.07, psu: parts && parts.psu ? (parts.psu.wattage >= 1000 ? 2.4 : parts.psu.wattage >= 750 ? 1.8 : 1.4) : 0, cooler: 0.7, case: 6.5 };
  if (!parts) return null;
  const total = Object.keys(weights).reduce((s, k) => s + (parts[k] ? weights[k] : 0), 0);
  return { kg: total.toFixed(1), lbs: (total * 2.205).toFixed(1), hasCase: !!parts.case };
}
function streamingQuality(parts) {
  if (!parts) return null;
  const cpuScore = parts.cpu ? (parts.cpu.cores >= 16 ? 95 : parts.cpu.cores >= 12 ? 85 : parts.cpu.cores >= 8 ? 70 : 50) : 0;
  const gpuScore = parts.gpu ? Math.min(100, parts.gpu.perf || 50) : 0;
  const ramScore = parts.ram ? (parts.ram.gb >= 32 ? 100 : parts.ram.gb >= 16 ? 80 : 50) : 0;
  const total = Math.round((cpuScore * 0.5 + gpuScore * 0.3 + ramScore * 0.2));
  const label = total >= 90 ? "Excellent (4K60 stream)" : total >= 75 ? "Great (1080p60 stream)" : total >= 55 ? "Good (1080p30 stream)" : "Basic (720p stream)";
  const color = total >= 90 ? "var(--c-good)" : total >= 75 ? "var(--c-accent)" : total >= 55 ? "var(--c-warn)" : "var(--c-bad)";
  return { score: total, label, color, cpuScore, gpuScore, ramScore };
}
function upgradeSuggestions(parts, useCase, budget) {
  const sugs = [];
  if (!parts) return sugs;
  if (parts.cpu && parts.cpu.cores < 8) sugs.push({ cat: "CPU", reason: "More cores = better multitasking & streaming. Aim for 8+ cores.", priority: "high" });
  if (parts.gpu && parts.gpu.vram < 8) sugs.push({ cat: "GPU", reason: "8GB+ VRAM handles 1080p/1440p modern titles comfortably.", priority: "high" });
  if (!parts.gpu && useCase !== "office") sugs.push({ cat: "GPU", reason: "A dedicated GPU will massively improve gaming & creative work.", priority: "high" });
  if (parts.ram && parts.ram.gb < 16) sugs.push({ cat: "RAM", reason: "16GB is the modern minimum. 32GB future-proofs for years.", priority: "medium" });
  if (parts.storage && (parts.storage.type || "").toLowerCase().includes("hdd")) sugs.push({ cat: "Storage", reason: "Upgrade to NVMe SSD for 30–50× faster load times.", priority: "medium" });
  if (!parts.cooler) sugs.push({ cat: "Cooler", reason: "An aftermarket cooler keeps temps 10–20°C lower for better boost clocks.", priority: "low" });
  return sugs.slice(0, 4);
}

/* ----------------------------- ANALYZE VIEW ----------------------------- */
function AnalyzeView({ parts: propParts, analysis: propAnalysis, useCase: propUseCase, onBack, saved }) {
  const [localBuild, setLocalBuild] = useState(null);
  const parts = localBuild ? localBuild.parts : propParts;
  const useCase = localBuild ? localBuild.useCase : propUseCase;
  const analysis = useMemo(() => localBuild ? analyzeBuild(localBuild.parts, localBuild.useCase, localBuild.budget) : propAnalysis, [localBuild, propAnalysis]);
  const handleBack = () => { if (localBuild) { setLocalBuild(null); return; } onBack(); };
  if (!parts || !analysis) return (
    <div className="rf-fade rf-community">
      <div className="rf-section-head" style={{marginBottom:"1rem"}}>
        <h2 style={{margin:0}}>🔬 Build Analysis</h2>
        <button className="rf-ghost" onClick={handleBack}><ChevronLeft size={15}/> Back</button>
      </div>
      <NoBuildPicker saved={saved} onPick={setLocalBuild} />
    </div>
  );
  const thermal = thermalEstimate(parts);
  const vr = vrReadiness(parts);
  const fk = gaming4K(parts);
  const oc = overclockSim(parts);
  const mem = memBandwidth(parts);
  const stor = storageTier(parts);
  const noise = noiseEstimate(parts);
  const weight = weightEstimate(parts);
  const streamQ = streamingQuality(parts);
  const upgrades = upgradeSuggestions(parts, useCase, analysis ? analysis.total : 0);

  const TempBar = ({ val, max = 100 }) => {
    const pct = Math.min(100, (val / max) * 100);
    const col = val > 85 ? "var(--c-bad)" : val > 75 ? "var(--c-warn)" : "var(--c-good)";
    return <div className="rf-budget-bar" style={{margin:"4px 0 8px"}}><div className="rf-budget-fill" style={{width:pct+"%",background:col}}/></div>;
  };

  return (
    <div className="rf-fade rf-community">
      <div className="rf-section-head" style={{marginBottom:"1.5rem"}}>
        <div>
          <h2 style={{margin:0}}>🔬 Build Analysis</h2>
          <p className="rf-muted" style={{marginTop:"0.3rem",fontSize:"0.85rem"}}>Deep performance metrics for your current build</p>
        </div>
        <button className="rf-ghost" onClick={handleBack}><ChevronLeft size={15}/> Back</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:"14px"}}>

        {/* Thermals */}
        <div className="rf-pe-card">
          <div className="rf-analyze-title">🌡️ Thermal Estimate</div>
          {thermal.cpuLoad !== null ? (
            <>
              <div className="rf-analyze-row"><span className="rf-muted">CPU under load</span><span style={{color:thermal.cpuLoad>85?"var(--c-bad)":thermal.cpuLoad>75?"var(--c-warn)":"var(--c-good)",fontWeight:700}}>{thermal.cpuLoad}°C</span></div>
              <TempBar val={thermal.cpuLoad} />
              {thermal.gpuLoad !== null && <>
                <div className="rf-analyze-row"><span className="rf-muted">GPU under load</span><span style={{color:thermal.gpuLoad>85?"var(--c-bad)":thermal.gpuLoad>78?"var(--c-warn)":"var(--c-good)",fontWeight:700}}>{thermal.gpuLoad}°C</span></div>
                <TempBar val={thermal.gpuLoad} />
              </>}
              {thermal.isAio && <p className="rf-muted" style={{fontSize:"0.78rem",margin:"4px 0 0"}}>AIO gives ~8°C advantage over air</p>}
            </>
          ) : <p className="rf-muted" style={{fontSize:"0.85rem"}}>Add CPU + cooler to estimate temps</p>}
        </div>

        {/* VR Readiness */}
        <div className="rf-pe-card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
            <div className="rf-analyze-title" style={{margin:0}}>🥽 VR Readiness</div>
            <span style={{fontSize:"0.8rem",fontWeight:700,color:vr.pass?"var(--c-good)":"var(--c-bad)"}}>{vr.tier}</span>
          </div>
          {vr.checks.map(c => (
            <div key={c.label} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid var(--c-border)"}}>
              <span style={{fontSize:"0.84rem"}}>{c.ok?"✅":"❌"} {c.label}</span>
              <span className="rf-muted" style={{fontSize:"0.8rem"}}>{c.detail}</span>
            </div>
          ))}
        </div>

        {/* 4K Check */}
        <div className="rf-pe-card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
            <div className="rf-analyze-title" style={{margin:0}}>🎮 Resolution Tier</div>
            <span style={{fontSize:"0.82rem",fontWeight:700,color:fk.color}}>{fk.tier}</span>
          </div>
          {parts.gpu ? (
            <>
              <div className="rf-analyze-row"><span className="rf-muted">VRAM</span><span>{parts.gpu.vram}GB</span></div>
              <div className="rf-analyze-row"><span className="rf-muted">GPU perf score</span><span>{parts.gpu.perf}/100</span></div>
              <div style={{marginTop:"10px",padding:"8px",borderRadius:"8px",background:"rgba(255,255,255,0.04)",fontSize:"0.8rem",color:"var(--c-muted)"}}>
                {fk.ready ? `GPU can handle ${fk.tier}` : `Best at ${fk.tier} — upgrade GPU for 4K`}
              </div>
            </>
          ) : <p className="rf-muted" style={{fontSize:"0.85rem"}}>Add a GPU to check resolution tier</p>}
        </div>

        {/* Overclock Sim */}
        <div className="rf-pe-card">
          <div className="rf-analyze-title">⚡ Overclock Potential</div>
          {oc ? (
            <>
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"10px"}}>
                <span className="rf-badge" style={{borderColor:oc.isUnlocked?"var(--c-good)":"var(--c-muted)",color:oc.isUnlocked?"var(--c-good)":"var(--c-muted)"}}>{oc.isUnlocked?"✓ Unlocked CPU":"✗ Locked CPU"}</span>
                <span className="rf-badge" style={{borderColor:oc.coolerOk?"var(--c-good)":"var(--c-warn)",color:oc.coolerOk?"var(--c-good)":"var(--c-warn)"}}>{oc.coolerOk?"✓ Cooler OK":"⚠ Weak Cooler"}</span>
              </div>
              <p style={{fontSize:"0.83rem",color:"var(--c-muted)",margin:"0 0 6px"}}>CPU: {oc.cpuGain}</p>
              {parts.ram && <p style={{fontSize:"0.83rem",color:"var(--c-muted)",margin:0}}>RAM XMP: {oc.ramSpeed} → {oc.ramTarget} MT/s <span style={{color:"var(--c-good)"}}>+{oc.ramGain}% est.</span></p>}
            </>
          ) : <p className="rf-muted" style={{fontSize:"0.85rem"}}>Add a CPU to check OC potential</p>}
        </div>

        {/* Memory Bandwidth */}
        <div className="rf-pe-card">
          <div className="rf-analyze-title">🧠 Memory Bandwidth</div>
          {mem ? (
            <>
              <div style={{fontSize:"2rem",fontWeight:700,color:"var(--c-accent)",fontFamily:"'JetBrains Mono'"}}>{mem.bw}<span style={{fontSize:"1rem",color:"var(--c-muted)",marginLeft:"4px"}}>GB/s</span></div>
              <div className="rf-analyze-row" style={{marginTop:"8px"}}>
                <span className="rf-muted">{mem.type} @ {mem.speed} MT/s (dual ch.)</span>
                <span style={{fontWeight:700,color:mem.tier==="Excellent"?"var(--c-good)":mem.tier==="Good"?"var(--c-accent)":"var(--c-warn)"}}>{mem.tier}</span>
              </div>
              <p className="rf-muted" style={{fontSize:"0.76rem",marginTop:"6px"}}>Theoretical peak — 128-bit dual-channel bus</p>
            </>
          ) : <p className="rf-muted" style={{fontSize:"0.85rem"}}>Add RAM to calculate bandwidth</p>}
        </div>

        {/* Storage Speed */}
        <div className="rf-pe-card">
          <div className="rf-analyze-title">💾 Storage Speed</div>
          {stor ? (
            <>
              <div className="rf-analyze-row" style={{marginBottom:"10px"}}>
                <span style={{fontWeight:700,color:stor.color}}>{stor.tier}</span>
                <span className="rf-muted" style={{fontSize:"0.82rem"}}>{stor.speed}</span>
              </div>
              <div style={{padding:"10px",borderRadius:"8px",background:"rgba(255,255,255,0.04)"}}>
                <div style={{fontSize:"0.78rem",color:"var(--c-muted)",marginBottom:"4px"}}>Game load time estimate</div>
                <div style={{fontWeight:700,fontSize:"1.1rem",color:stor.color}}>{stor.gameLoad}</div>
              </div>
              <p className="rf-muted" style={{fontSize:"0.76rem",marginTop:"8px"}}>NVMe is 10–50× faster than HDD. SATA SSD is 5–10× faster.</p>
            </>
          ) : <p className="rf-muted" style={{fontSize:"0.85rem"}}>Add storage to see speed tier</p>}
        </div>

        {/* Deprecation Alerts */}
        {(() => {
          const alerts = deprecationAlerts(parts);
          return (
            <div className="rf-pe-card">
              <div className="rf-analyze-title">⚠️ Deprecation Alerts</div>
              {alerts.length === 0
                ? <p style={{color:"var(--c-good)",fontSize:"0.85rem"}}>✅ No deprecated platforms detected</p>
                : alerts.map((a,i) => (
                  <div key={i} style={{display:"flex",gap:"8px",padding:"7px 10px",borderRadius:"8px",marginBottom:"6px",
                    background: a.sev==="bad"?"rgba(255,92,114,0.08)":a.sev==="warn"?"rgba(255,194,75,0.08)":"rgba(25,232,219,0.06)",
                    border:`1px solid ${a.sev==="bad"?"rgba(255,92,114,0.3)":a.sev==="warn"?"rgba(255,194,75,0.3)":"rgba(25,232,219,0.2)"}`}}>
                    <span style={{fontSize:"0.82rem",color:a.sev==="bad"?"var(--c-bad)":a.sev==="warn"?"var(--c-warn)":"var(--c-muted)"}}>{a.text}</span>
                  </div>
                ))
              }
            </div>
          );
        })()}

        {/* Power Delivery Validator */}
        {(() => {
          const pwr = powerDeliveryCheck(parts);
          return (
            <div className="rf-pe-card">
              <div className="rf-analyze-title">🔌 Power Delivery</div>
              {pwr.status === "none"
                ? <p className="rf-muted" style={{fontSize:"0.85rem"}}>Add a PSU to validate power delivery</p>
                : <>
                  <div className="rf-analyze-row"><span className="rf-muted">System draw (est.)</span><span>{pwr.required}W</span></div>
                  <div className="rf-analyze-row"><span className="rf-muted">PSU rated</span><span>{pwr.psuWatt}W</span></div>
                  <div className="rf-analyze-row"><span className="rf-muted">Boost spike (125%)</span><span style={{color:pwr.spikeOk?"var(--c-good)":"var(--c-bad)"}}>{pwr.spikeRequired}W {pwr.spikeOk?"✓":"✗"}</span></div>
                  <div style={{marginTop:"8px",padding:"8px 10px",borderRadius:"8px",
                    background:pwr.status==="bad"?"rgba(255,92,114,0.1)":pwr.status==="tight"?"rgba(255,194,75,0.08)":"rgba(70,224,160,0.08)",
                    border:`1px solid ${pwr.status==="bad"?"rgba(255,92,114,0.3)":pwr.status==="tight"?"rgba(255,194,75,0.3)":"rgba(70,224,160,0.2)"}`}}>
                    <span style={{fontSize:"0.82rem",color:pwr.status==="bad"?"var(--c-bad)":pwr.status==="tight"?"var(--c-warn)":"var(--c-good)"}}>
                      {pwr.status==="bad" ? `⚠ PSU underpowered — ${Math.abs(pwr.margin)}W short` : pwr.status==="tight" ? `⚠ Tight headroom (${pwr.margin}W)` : `✓ ${pwr.margin}W headroom — solid`}
                    </span>
                  </div>
                </>
              }
            </div>
          );
        })()}

        {/* Display Output Check */}
        {(() => {
          const disp = displayOutputCheck(parts);
          return (
            <div className="rf-pe-card">
              <div className="rf-analyze-title">🖥️ Display Outputs</div>
              {disp.ports.length === 0
                ? <p className="rf-muted" style={{fontSize:"0.85rem"}}>No display outputs detected</p>
                : <>
                  {disp.ports.map((p,i) => <div key={i} style={{fontSize:"0.84rem",padding:"5px 0",borderBottom:"1px solid var(--c-border)"}}>{p}</div>)}
                  <p className="rf-muted" style={{fontSize:"0.78rem",marginTop:"8px"}}>{disp.note}</p>
                </>
              }
            </div>
          );
        })()}

        {/* BIOS Compat */}
        {(() => {
          const bios = biosCompatWarning(parts);
          return (
            <div className="rf-pe-card">
              <div className="rf-analyze-title">🔧 BIOS Compatibility</div>
              {!parts.cpu || !parts.mobo
                ? <p className="rf-muted" style={{fontSize:"0.85rem"}}>Add CPU + motherboard to check BIOS compat</p>
                : bios.length === 0
                ? <p style={{color:"var(--c-good)",fontSize:"0.85rem"}}>✅ No BIOS issues detected for this combination</p>
                : bios.map((w,i) => (
                  <div key={i} style={{padding:"7px 10px",borderRadius:"8px",marginBottom:"6px",background:"rgba(255,194,75,0.08)",border:"1px solid rgba(255,194,75,0.3)"}}>
                    <span style={{fontSize:"0.82rem",color:"var(--c-warn)"}}>⚠ {w}</span>
                  </div>
                ))
              }
            </div>
          );
        })()}

        {/* USB Port Estimate */}
        {(() => {
          const usb = usbPortEstimate(parts);
          return (
            <div className="rf-pe-card">
              <div className="rf-analyze-title">🔌 USB Port Estimate</div>
              {!usb
                ? <p className="rf-muted" style={{fontSize:"0.85rem"}}>Add a motherboard to estimate USB ports</p>
                : <>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"8px"}}>
                    {[["USB 2.0",usb.usb2],["USB 3.2 Gen1",usb.usb3],["USB 3.2 Gen2",usb.usb32],["USB-C",usb.usbc]].map(([label,n])=>(
                      <div key={label} style={{padding:"8px",borderRadius:"8px",background:"rgba(255,255,255,0.04)",textAlign:"center"}}>
                        <div style={{fontWeight:700,fontSize:"1.2rem",color:"var(--c-accent)"}}>{n}</div>
                        <div style={{fontSize:"0.72rem",color:"var(--c-muted)"}}>{label}</div>
                      </div>
                    ))}
                  </div>
                  <p className="rf-muted" style={{fontSize:"0.76rem"}}>~{usb.total} rear ports estimated ({usb.form}, {usb.tier}-end board). Exact count varies by model.</p>
                </>
              }
            </div>
          );
        })()}

        {/* Cable Management */}
        {(() => {
          const cables = cableManagementList(parts);
          return (
            <div className="rf-pe-card">
              <div className="rf-analyze-title">🪢 Cable Management Guide</div>
              {cables.length === 0
                ? <p className="rf-muted" style={{fontSize:"0.85rem"}}>Add a PSU to generate cable list</p>
                : cables.map((c,i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:"8px",padding:"6px 0",borderBottom:"1px solid var(--c-border)",fontSize:"0.84rem"}}>
                    <span style={{color:"var(--c-accent)",fontSize:"0.7rem"}}>▸</span>{c}
                  </div>
                ))
              }
            </div>
          );
        })()}

        {/* C7: Noise Estimate */}
        <div className="rf-pe-card">
          <div className="rf-analyze-title">🔊 Noise Estimate</div>
          {noise ? (
            <>
              <div style={{fontSize:"2rem",fontWeight:700,color:noise.color,fontFamily:"'JetBrains Mono'"}}>{noise.dbEst}<span style={{fontSize:"1rem",color:"var(--c-muted)",marginLeft:"4px"}}>dB est.</span></div>
              <div className="rf-analyze-row" style={{marginTop:"8px"}}><span className="rf-muted">Rating</span><span style={{fontWeight:700,color:noise.color}}>{noise.label}</span></div>
              {noise.isPassive && <p className="rf-muted" style={{fontSize:"0.78rem",marginTop:"6px"}}>Passive cooler — near-silent operation</p>}
              {noise.isAio && <p className="rf-muted" style={{fontSize:"0.78rem",marginTop:"6px"}}>AIO liquid cooler runs quieter than air towers</p>}
            </>
          ) : <p className="rf-muted" style={{fontSize:"0.85rem"}}>Add a cooler to estimate noise level</p>}
        </div>

        {/* C8: Weight Estimate */}
        <div className="rf-pe-card">
          <div className="rf-analyze-title">⚖️ Weight Estimate</div>
          {weight ? (
            <>
              <div style={{fontSize:"2rem",fontWeight:700,color:"var(--c-accent)",fontFamily:"'JetBrains Mono'"}}>{weight.kg}<span style={{fontSize:"1rem",color:"var(--c-muted)",marginLeft:"4px"}}>kg</span></div>
              <div className="rf-analyze-row" style={{marginTop:"8px"}}><span className="rf-muted">Imperial</span><span>{weight.lbs} lbs</span></div>
              {!weight.hasCase && <p className="rf-muted" style={{fontSize:"0.78rem",marginTop:"6px"}}>Add a case for a full weight estimate (case is ~50% of total)</p>}
              <p className="rf-muted" style={{fontSize:"0.76rem",marginTop:"6px"}}>Estimate — actual weight varies by exact parts</p>
            </>
          ) : <p className="rf-muted" style={{fontSize:"0.85rem"}}>Add parts to estimate build weight</p>}
        </div>

        {/* C9: Streaming Quality */}
        <div className="rf-pe-card">
          <div className="rf-analyze-title">📺 Streaming Quality</div>
          {streamQ && (streamQ.cpuScore > 0 || streamQ.gpuScore > 0) ? (
            <>
              <div style={{fontSize:"1.8rem",fontWeight:700,color:streamQ.color,fontFamily:"'JetBrains Mono'"}}>{streamQ.score}<span style={{fontSize:"0.9rem",color:"var(--c-muted)",marginLeft:"4px"}}>/100</span></div>
              <div className="rf-analyze-row" style={{marginTop:"6px"}}><span className="rf-muted">Tier</span><span style={{fontWeight:700,color:streamQ.color,fontSize:"0.82rem"}}>{streamQ.label}</span></div>
              <div className="rf-analyze-row"><span className="rf-muted">CPU score</span><span>{streamQ.cpuScore}/100</span></div>
              <div className="rf-analyze-row"><span className="rf-muted">GPU score</span><span>{streamQ.gpuScore}/100</span></div>
              <div className="rf-analyze-row"><span className="rf-muted">RAM score</span><span>{streamQ.ramScore}/100</span></div>
            </>
          ) : <p className="rf-muted" style={{fontSize:"0.85rem"}}>Add CPU & GPU to evaluate streaming quality</p>}
        </div>

        {/* C10: Upgrade Path */}
        <div className="rf-pe-card">
          <div className="rf-analyze-title">🚀 Upgrade Path</div>
          {upgrades.length === 0 ? (
            <p style={{color:"var(--c-good)",fontSize:"0.85rem"}}>✅ Build looks well-optimised — no obvious bottlenecks</p>
          ) : upgrades.map((u, i) => (
            <div key={i} style={{display:"flex",gap:"10px",padding:"8px 0",borderBottom:"1px solid var(--c-border)"}}>
              <span style={{fontWeight:700,color:u.priority==="high"?"var(--c-bad)":u.priority==="medium"?"var(--c-warn)":"var(--c-accent)",minWidth:"62px",fontSize:"0.8rem"}}>{u.cat}</span>
              <span style={{fontSize:"0.81rem",color:"var(--c-muted)"}}>{u.reason}</span>
            </div>
          ))}
        </div>

        {/* C13: Streaming Setup Checklist */}
        <div className="rf-pe-card">
          <div className="rf-analyze-title">🎙️ Streaming Setup Checklist</div>
          {[
            { label: "CPU 8+ cores", ok: parts.cpu && parts.cpu.cores >= 8 },
            { label: "32GB+ RAM", ok: parts.ram && parts.ram.gb >= 32 },
            { label: "Dedicated GPU", ok: !!parts.gpu },
            { label: "NVMe SSD", ok: parts.storage && (parts.storage.type || "").toLowerCase().includes("nvme") },
            { label: "Quiet cooler", ok: !!noise && noise.dbEst < 40 },
          ].map((item, i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid var(--c-border)",fontSize:"0.84rem"}}>
              <span>{item.ok ? "✅" : "❌"} {item.label}</span>
            </div>
          ))}
          <p className="rf-muted" style={{fontSize:"0.76rem",marginTop:"8px"}}>For a dedicated streaming/content PC alongside a gaming rig, you can prioritise CPU over GPU.</p>
        </div>

        {/* C13: LAN Party Checklist */}
        <div className="rf-pe-card">
          <div className="rf-analyze-title">🌐 LAN Party Checklist</div>
          {[
            { label: "Portable (under 10 kg)", ok: weight && +weight.kg < 10 },
            { label: "Quiet cooler (<40 dB)", ok: noise && noise.dbEst < 40 },
            { label: "Modular PSU (easier cables)", ok: parts.psu && (parts.psu.name || "").toLowerCase().includes("modular") },
            { label: "Mid/ITX case", ok: parts.case && /(itx|mini|micro|slim)/i.test(parts.case.name || "") },
            { label: "Gaming GPU", ok: !!parts.gpu && parts.gpu.perf >= 70 },
          ].map((item, i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid var(--c-border)",fontSize:"0.84rem"}}>
              <span>{item.ok ? "✅" : "❌"} {item.label}</span>
            </div>
          ))}
          <p className="rf-muted" style={{fontSize:"0.76rem",marginTop:"8px"}}>A compact, lighter build makes LAN events much more enjoyable.</p>
        </div>

      </div>
    </div>
  );
}

/* ----------------------------- SURVEY ----------------------------- */
function Survey({ onPick }) {
  const [sel, setSel] = useState([]);
  const toggle = (k) => setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  return (
    <div className="rf-fade rf-step">
      <div className="rf-step-head">
        <div className="rf-eyebrow">STEP 1 OF 2</div>
        <h2>{t("useCaseQ")}</h2>
        <p className="rf-muted">Pick one or more — this sets which parts matter most and how your budget gets split.</p>
      </div>
      <div className="rf-uc-grid">
        {BASE_UC_KEYS.map((k, i) => {
          const uc = USE_CASES[k];
          const on = sel.includes(k);
          return (
            <button key={k} className={"rf-uc-card rf-pop" + (on ? " sel" : "")} style={{ animationDelay: i * 55 + "ms" }} onClick={() => toggle(k)}>
              <div className="rf-uc-icon"><uc.Icon size={24} /></div>
              <div className="rf-uc-label">{tUC(k)}</div>
              <div className="rf-uc-tag">{tUCtag(k)}</div>
              <div className={"rf-uc-check" + (on ? " on" : "")}>{on && <Check size={14} />}</div>
            </button>
          );
        })}
      </div>
      <div className="rf-step-foot">
        <span className="rf-muted rf-sm">{sel.length ? sel.map(tUC).join(" + ") : "Select at least one"}</span>
        <button className="rf-btn rf-btn-lg" disabled={!sel.length} onClick={() => onPick(sel)}>Next <ChevronRight size={18} /></button>
      </div>
    </div>
  );
}

/* ---- R19: Per-category inline SVG icons ---- */
const CAT_SVG_PATHS = {
  cpu:     "M4 4h16v16H4V4zm3 3v10h10V7H7zm3 3h4v4h-4v-4z",
  gpu:     "M2 7h20v10H2V7zm2 2v6h16V9H4zm3 1h2v4H7v-4zm4 0h2v4h-2v-4zm4 0h2v4h-2v-4z",
  mobo:    "M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h4v2H7V7zm6 0h4v2h-4V7zm-6 4h2v4H7v-4zm4 0h6v2h-6v-2zm0 3h6v1h-6v-1z",
  ram:     "M6 4h12v16H6V4zm2 2v2h8V6H8zm0 4v2h8v-2H8zm0 4v2h8v-2H8z",
  storage: "M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h12V6H6zm7 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
  psu:     "M3 5h18v14H3V5zm2 2v10h14V7H5zm4 2h6v2h-6V9zm2 3h2v4h-2v-4z",
  case:    "M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm1 2v16h12V4H6zm3 3h6v2H9V7zm0 4h6v1H9v-1z",
  cooler:  "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 2a8 8 0 0 1 0 16A8 8 0 0 1 12 4zm0 3a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z",
};
function CatIcon({ cat }) {
  const d = CAT_SVG_PATHS[cat];
  if (!d) return null;
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="rf-cat-icon" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* ---- R16: Allocation donut chart ---- */
const DONUT_COLORS = ["#1ff5e6","#a07aff","#f59e0b","#34d399","#f472b6","#60a5fa","#fb923c","#a3e635"];
function AllocDonut({ alloc }) {
  const cats = CATEGORY_ORDER.filter((c) => (alloc[c] || 0) > 0);
  const total = cats.reduce((s, c) => s + alloc[c], 0);
  const r = 38, cx = 50, cy = 50, stroke = 14;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const segments = cats.map((c, i) => {
    const pct = alloc[c] / total;
    const dash = pct * circ;
    const seg = { c, color: DONUT_COLORS[i % DONUT_COLORS.length], dash, offset };
    offset += dash;
    return seg;
  });
  return (
    <svg className="rf-alloc-donut" viewBox="0 0 100 100" width={80} height={80} aria-hidden="true">
      {segments.map(({ c, color, dash, offset: off }) => (
        <circle key={c} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-off + circ * 0.25}
          style={{ transition: "stroke-dasharray 0.7s var(--ease)" }} />
      ))}
    </svg>
  );
}

/* ----------------------------- BUDGET ----------------------------- */
function BudgetStep({ useCase, budget, setBudget, onBack, onAuto, onManual }) {
  const UC = USE_CASES[useCase];
  const MIN = 500, MAX = 4000;
  const pct = ((budget - MIN) / (MAX - MIN)) * 100;
  const presets = [700, 1200, 2000, 3000];
  return (
    <div className="rf-fade rf-step">
      <div className="rf-step-head">
        <div className="rf-eyebrow">STEP 2 OF 2 · {tUC(useCase).toUpperCase()}</div>
        <h2>{t("budgetQ")}</h2>
        <p className="rf-muted">Drag to set your total spend. We reserve the essentials first, then spend the rest where it counts.</p>
      </div>

      <div className="rf-budget-display">{fmt(budget)}</div>

      <div className="rf-slider-wrap">
        <input
          type="range" min={MIN} max={MAX} step={50} value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="rf-slider"
          style={{ background: `linear-gradient(90deg, var(--c-accent) ${pct}%, var(--c-track) ${pct}%)` }}
        />
        <div className="rf-slider-ends"><span>{fmt(MIN)}</span><span>{fmt(MAX)}</span></div>
      </div>

      <div className="rf-presets">
        {presets.map((p) => (
          <button key={p} className={"rf-preset" + (budget === p ? " active" : "")} onClick={() => setBudget(p)}>{fmt(p)}</button>
        ))}
      </div>

      {/* live allocation preview */}
      <div className="rf-alloc">
        <div className="rf-alloc-title">How your {fmt(budget)} splits for {tUC(useCase)}</div>
        <div className="rf-alloc-inner">
          <div className="rf-alloc-bars">
            {CATEGORY_ORDER.filter((c) => UC.alloc[c] > 0).map((c) => (
              <div key={c} className="rf-alloc-row">
                <span className="rf-alloc-lbl">{tCat(c)}</span>
                <div className="rf-alloc-track"><div className="rf-alloc-fill" style={{ width: UC.alloc[c] * 2.4 + "%" }} /></div>
                <span className="rf-alloc-val">{fmt((budget * UC.alloc[c]) / 100)}</span>
              </div>
            ))}
          </div>
          <AllocDonut alloc={UC.alloc} />
        </div>
      </div>

      <div className="rf-forge-btns">
        <button type="button" className="rf-forge-btn primary" onClick={onAuto}>
          <Sparkles size={15} /> {t("autoForge")}
        </button>
        <button type="button" className="rf-forge-btn outline" onClick={onManual}>
          <Wrench size={15} /> {t("buildYourself")}
        </button>
      </div>

      <div className="rf-step-actions center">
        <button type="button" className="rf-ghost" onClick={onBack}><ChevronLeft size={16} /> {t("back")}</button>
      </div>
    </div>
  );
}

/* ----------------------------- RESULTS ----------------------------- */
function Results({ useCase, budget, parts, analysis, verdict, aiBusy, onGenerate, expanded, setExpanded, onSwap, onRemove, onRegen, onSave, onShare, onShareLogin, on3D, onPower, onShareLink, shareCopied, isOnline, onAnalyze, onTools, onNavigate }) {
  const UC = USE_CASES[useCase];
  const a = analysis;
  const [shareOpen, setShareOpen] = useState(false);
  const [shareTitle, setShareTitle] = useState("");
  const [shareStatus, setShareStatus] = useState(null); // null | "posting" | "done" | "error"
  const [textCopied, setTextCopied] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const shownTotal = CATEGORY_ORDER.reduce((s, c) => { const p = parts[c]; return s + (p && !partOOS(p) ? p.price : 0); }, 0);
  const overBudget = shownTotal > budget;
  const copyAsText = () => {
    const lines = [`ForgeAPC Build — ${USE_CASES[useCase].label} · ${fmt(budget)} budget`, ""];
    CATEGORY_ORDER.forEach(c => { const p = parts[c]; if (p) lines.push(`${CAT_META[c].label}: ${p.name} (${fmt(p.price)})`); });
    lines.push("", `Total: ${fmt(shownTotal)}`, `Performance: ${a.score}/1000 · Price/Perf: ${a.ppScore}/100`);
    navigator.clipboard.writeText(lines.join("\n")).then(() => { setTextCopied(true); setTimeout(() => setTextCopied(false), 2500); });
  };

  const doShare = async () => {
    if (!shareTitle.trim()) return;
    setShareStatus("posting");
    const res = await onShare(shareTitle.trim());
    setShareStatus(res === undefined ? "done" : "error");
    if (res === undefined) setTimeout(() => setShareOpen(false), 1500);
  };

  return (
    <div className="rf-fade">
      <div className="rf-results-head">
        <div>
          <div className="rf-eyebrow"><UC.Icon size={13} /> {tUC(useCase)} · {fmt(budget)} {t("budget")}</div>
          <h2>{t("yourBuild")}</h2>
        </div>
        <div className="rf-results-actions">
          <button className="rf-ghost" onClick={onRegen}><Sparkles size={15} /> Auto-forge</button>
          <button className="rf-ghost" onClick={on3D}><LayoutGrid size={15} /> 3D View</button>
          <div style={{position:"relative"}}>
            <button className="rf-ghost" onClick={() => setMoreMenuOpen((o) => !o)}>
              <LayoutGrid size={15} /> More {moreMenuOpen ? "▲" : "▾"}
            </button>
            {moreMenuOpen && (
              <div className="rf-more-dropdown" onClick={() => setMoreMenuOpen(false)}>
                {[
                  { icon: <Zap size={14}/>,         label: "Analyze",           view: "analyze" },
                  { icon: <DollarSign size={14}/>,   label: "Cost Tools",        view: "tools" },
                  { icon: <Gamepad2 size={14}/>,     label: "FPS & Games",       view: "fps-games" },
                  { icon: <Sparkles size={14}/>,     label: "Build Stats",       view: "build-stats" },
                  { icon: <Zap size={14}/>,          label: "Power & Peripherals", view: "power-peripherals" },
                  { icon: <Save size={14}/>,         label: "Export & More",     view: "export-more" },
                ].map(({ icon, label, view }) => (
                  <button key={view} className="rf-more-dropdown-item" onClick={() => onNavigate && onNavigate(view)}>
                    {icon} {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {onShare ? (
            <button className="rf-ghost" onClick={() => { setShareTitle(""); setShareStatus(null); setShareOpen(true); }}><Globe size={15} /> Share</button>
          ) : (
            <button className="rf-ghost" onClick={onShareLogin}><Globe size={15} /> Share</button>
          )}
          <button className="rf-btn" onClick={onSave}><Save size={16} /> {t("saveRig")}</button>
        </div>
      </div>

      {shareOpen && (
        <div className="rf-modal-wrap" onClick={() => setShareOpen(false)}>
          <div className="rf-modal" onClick={e => e.stopPropagation()}>
            <div className="rf-modal-head"><Globe size={16} /> Share to Community</div>
            <p className="rf-muted" style={{fontSize:"0.85rem",marginBottom:"0.75rem"}}>Give your build a title so others can find it.</p>
            <input className="rf-input" placeholder="e.g. Budget 4K Gaming Beast" value={shareTitle} onChange={e => setShareTitle(e.target.value)} maxLength={80} onKeyDown={e => e.key === "Enter" && doShare()} autoFocus />
            {shareStatus === "done" && <p style={{color:"var(--c-accent)",marginTop:"0.5rem"}}>Posted to Community!</p>}
            {shareStatus === "error" && <p style={{color:"var(--c-bad)",marginTop:"0.5rem"}}>Something went wrong — try again.</p>}
            {shareStatus === "limit" && <p style={{color:"var(--c-warn)",marginTop:"0.5rem"}}>Free tier limit: max 5 community builds. Delete one to post another.</p>}
            <div className="rf-modal-row">
              <button className="rf-ghost" onClick={() => setShareOpen(false)}>Cancel</button>
              <button className="rf-btn" onClick={doShare} disabled={shareStatus === "posting" || shareStatus === "done"}><Upload size={15} /> {shareStatus === "posting" ? "Posting…" : "Post"}</button>
            </div>
          </div>
        </div>
      )}

      {/* scorecard */}
      <div className="rf-scorecard rf-pop">
        <div className="rf-gauges">
          <Gauge value={a.score} max={1000} label={t("performance")} accent={scoreColor(a.score / 10)} />
          <Gauge value={a.ppScore} label={t("pricePerf")} accent={scoreColor(a.ppScore)} delay={120} />
        </div>
        <div className="rf-verdict">
          <div className="rf-verdict-tag"><Sparkles size={13} /> AI verdict <span className="rf-hybrid">Opus 4.8</span>{aiBusy && <span className="rf-verdict-state"> · thinking…</span>}</div>
          {verdict === "__offline__" ? (
            <p className="rf-offline-msg">AI unavailable — connect to the internet to generate a verdict.</p>
          ) : verdict ? (
            <p>{verdict}</p>
          ) : aiBusy ? (
            <p className="rf-verdict-busy">Analyzing your build with current prices…</p>
          ) : isOnline === false ? (
            <p className="rf-offline-msg">AI unavailable offline — connect to generate a verdict.</p>
          ) : (
            <button className="rf-forge-btn outline rf-verdict-btn" onClick={onGenerate}><Sparkles size={14} /> Generate AI verdict</button>
          )}
          <div className="rf-total-row">
            <span className="rf-muted">Total</span>
            <span className={"rf-total" + (overBudget ? " over" : "")}>{fmt(shownTotal)}</span>
            <div className="rf-budget-bar">
              <div className="rf-budget-fill" style={{ width: clamp((shownTotal / budget) * 100, 0, 100) + "%", background: overBudget ? "var(--c-bad)" : "var(--c-accent)" }} />
            </div>
            <span className="rf-muted">{fmt(budget)}</span>
          </div>
        </div>
      </div>

      {/* compatibility banner */}
      <div className={"rf-compat " + (!a.compat.pass ? "bad" : !a.complete ? "warn" : "ok")}>
        {!a.compat.pass ? <ShieldAlert size={18} /> : !a.complete ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
        <div>
          <strong>
            {!a.compat.pass
              ? `${a.compat.issues.length} compatibility issue${a.compat.issues.length > 1 ? "s" : ""}`
              : !a.complete
              ? `${a.missing.length} part${a.missing.length > 1 ? "s" : ""} still to add`
              : "All compatibility checks passed"}
          </strong>
          {!a.compat.pass && <ul>{a.compat.issues.map((m, i) => <li key={i}>{m}</li>)}</ul>}
          {a.compat.pass && !a.complete && (
            <span className="rf-compat-sub">{a.missing.map((c) => tCat(c)).join(", ")}</span>
          )}
        </div>
      </div>

      {/* badges + bottleneck + noise + actions row */}
      {(() => {
        const badges = buildBadges(parts, a, useCase);
        const bn = detectBottleneck(parts);
        const noise = noiseRating(parts);
        return (
          <div className="rf-build-meta">
            <div className="rf-build-badges">
              {badges.map(b => <span key={b.label} className="rf-badge" style={{borderColor:b.color,color:b.color}}>{b.icon} {b.label}</span>)}
              <span className="rf-badge" style={{borderColor:noise.color,color:noise.color}}>🔊 {noise.label}</span>
            </div>
            {bn && <div className="rf-bottleneck"><AlertTriangle size={13} /> {bn.msg}</div>}
            <div className="rf-build-actions-row">
              <button className="rf-ghost rf-sm-btn" onClick={onPower}>⚡ Power cost</button>
              <button className="rf-ghost rf-sm-btn" onClick={onShareLink}>{shareCopied ? <><Check size={12} /> Copied!</> : <><Globe size={12} /> Share link</>}</button>
              <button className="rf-ghost rf-sm-btn" onClick={copyAsText}>{textCopied ? <><Check size={12} /> Copied text!</> : <>📋 Copy as text</>}</button>
            </div>
          </div>
        );
      })()}

      {/* part list */}
      <div className="rf-parts">
        {CATEGORY_ORDER.map((cat, i) => {
          const part = parts[cat];
          const skip = UC.alloc[cat] === 0 && !part;
          const band = (budget * UC.alloc[cat]) / 100;
          const Meta = CAT_META[cat];
          const status = part ? budgetStatus(part.price, band) : "within";
          const compatible = part ? isPartCompatible(parts, cat) : true;
          const sc = part ? (compatible ? partScore({ ...part, cat }, band, useCase) : 0) : 0;
          const isOpen = expanded[cat];
          return (
            <div key={cat} className="rf-part rf-pop" style={{ animationDelay: i * 60 + "ms" }}>
              <div className="rf-part-top">
                <div className="rf-part-media">
                {part && part.img ? (
                  <a href={part.url || "#"} target="_blank" rel="noopener noreferrer" className="rf-part-img-link" onClick={(e) => e.stopPropagation()} title="View product page">
                    <img src={part.img} alt={part.name} className="rf-part-img" loading="lazy" />
                  </a>
                ) : (
                  <div className="rf-part-icon"><Meta.Icon size={20} /></div>
                )}
                {part && part._source && <span className={"rf-part-src " + part._source}>{({ amazon: "Amazon", newegg: "Newegg", bestbuy: "Best Buy" })[part._source] || ""}</span>}
                </div>
                <div className="rf-part-info">
                  <div className="rf-part-cat"><CatIcon cat={cat} />{tCat(cat)}</div>
                  {part ? (
                    <div className="rf-part-name">{part.name}</div>
                  ) : skip ? (
                    <div className="rf-part-name rf-muted">Integrated graphics — no discrete GPU</div>
                  ) : (
                    <div className="rf-part-name rf-muted">Empty</div>
                  )}
                </div>

                {part && (
                  <>
                    <div className="rf-part-price-col">
                      {partOOS(part) ? (
                        <div className="rf-part-price rf-oos-price">{t("outOfStock")}</div>
                      ) : (
                        <>
                          <div className={"rf-part-price " + status}>{fmt(part.price)}</div>
                          {status === "over" && <div className="rf-flag over">OVER BUDGET</div>}
                          {status === "tight" && <div className="rf-flag tight">A bit over</div>}
                        </>
                      )}
                    </div>
                    <div className="rf-part-score" style={{ borderColor: scoreColor(sc), color: scoreColor(sc) }}>{sc}</div>
                  </>
                )}
              </div>

              <div className="rf-part-actions">
                {part && (
                  <button className="rf-chip-btn" onClick={() => setExpanded((e) => ({ ...e, [cat]: !e[cat] }))}>
                    {isOpen ? <ChevronLeft size={13} style={{ transform: "rotate(90deg)" }} /> : <Sparkles size={13} />}
                    {isOpen ? t("hideInfo") : t("moreInfo")}
                  </button>
                )}
                <button className="rf-chip-btn primary" onClick={() => onSwap(cat)}><Repeat2 size={13} /> {part ? "Swap" : "Add"}</button>
              </div>

              {part && isOpen && <InfoPanel cat={cat} part={part} band={band} status={status} useCase={useCase} incompatible={!compatible} enableAsk budget={budget} parts={parts} isOnline={isOnline} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------- General facts + a personalized "for you" note ------- */
function partFacts(cat, part) {
  switch (cat) {
    case "cpu": return [`${part.cores} cores`, `${part.socket} socket`, `${part.tdp}W TDP`, part.igpu ? "Integrated graphics" : "Needs a GPU"];
    case "gpu": return [`${part.vram}GB VRAM`, `${part.tdp}W draw`, `${part.len}mm long`];
    case "mobo": return [`${part.socket}`, `${part.ramType}`, `${part.form}`, `${part.m2} M.2 slot${part.m2 > 1 ? "s" : ""}`];
    case "ram": return [`${part.cap}GB`, `${part.ramType}`, `${part.speed} MT/s`];
    case "storage": return [`${part.cap >= 1000 ? part.cap / 1000 + "TB" : part.cap + "GB"}`, `${part.kind}`, `${part.iface}`];
    case "psu": return [`${part.watt}W`, `80+ ${part.eff}`];
    case "case": return [`Fits ${part.forms.join("/")}`, `GPU ≤ ${part.maxGpu}mm`, `Cooler ≤ ${part.maxCool}mm`];
    case "cooler": return [`${part.type.toUpperCase()}`, `${part.tdpRating}W rated`, part.type === "air" ? `${part.height}mm tall` : "Liquid"];
    default: return [];
  }
}
function partProsCons(cat, part, band, status, useCase) {
  const pros = [];
  const cons = [];
  const ratio = ucPerf(cat, part, useCase) / ucMaxPerf(cat, useCase);
  const high = ratio >= 0.8;
  const mid = ratio >= 0.5 && ratio < 0.8;
  const low = ratio < 0.4;
  const uc = USE_CASES[useCase];
  const ucLabel = uc.label.toLowerCase();

  // budget — requested behaviour: over budget shows up as a con
  if (status === "over") cons.push("Over budget");
  else if (status === "tight") cons.push(`Slightly over your ${fmt(band)} budget slice`);
  else pros.push(`Fits your ${fmt(band)} budget slice`);

  // performance tier
  if (high) pros.push("Top-tier performance in its class");
  else if (mid) pros.push("Solid mid-range performance");
  if (low) cons.push("Entry-level performance");

  switch (cat) {
    case "cpu":
      if (part.cores >= 12) pros.push(`${part.cores} cores — great for multitasking & productivity`);
      if (part.igpu) pros.push("Integrated graphics — runs without a GPU");
      else cons.push("No integrated graphics — needs a discrete GPU");
      if (part.tdp >= 150) cons.push(`High ${part.tdp}W power draw — wants strong cooling`);
      if (uc.alloc.gpu === 0 && !part.igpu) cons.push("No iGPU — unsuitable for a GPU-less office build");
      break;
    case "gpu":
      if (part.vram >= 16) pros.push(`${part.vram}GB VRAM — strong for high-res & AI work`);
      if (part.vram <= 8) cons.push(`Only ${part.vram}GB VRAM — limiting at 1440p+ and for AI`);
      if (part.tdp >= 280) cons.push(`High ${part.tdp}W draw — needs a beefy PSU & airflow`);
      if (part.len >= 320) cons.push(`${part.len}mm long — check case clearance`);
      if (["gaming", "ai"].includes(useCase) && high) pros.push(`Excellent match for ${ucLabel}`);
      if (uc.alloc.gpu === 0) cons.push("Unnecessary for office use — integrated graphics suffice");
      break;
    case "mobo":
      if (part.m2 >= 3) pros.push(`${part.m2} M.2 slots — room for multiple fast drives`);
      if (part.maxRam >= 192) pros.push(`Supports up to ${part.maxRam}GB RAM`);
      if (part.form === "ITX") cons.push("ITX — limited expansion & RAM slots");
      pros.push(`${part.ramType} platform`);
      break;
    case "ram":
      if (part.cap >= 32) pros.push(`${part.cap}GB — comfortable for demanding workloads`);
      if (part.cap <= 16) cons.push(`${part.cap}GB — tight for heavy multitasking`);
      if (part.ramType === "DDR5" && part.speed >= 6000) pros.push(`Fast ${part.speed} MT/s DDR5`);
      if (part.ramType === "DDR4") cons.push("Older DDR4 standard (end-of-life platform)");
      if (part.price >= 600) cons.push("Expensive — memory-shortage premium");
      break;
    case "storage":
      if (part.kind === "NVMe") pros.push("Fast NVMe (M.2)");
      if (part.kind === "SATA") cons.push("Slower SATA interface");
      if (part.cap >= 2000) pros.push(`${part.cap / 1000}TB — plenty of space`);
      if (part.cap <= 1000) cons.push("1TB — can fill up fast with large games");
      break;
    case "psu":
      if (["Gold", "Platinum", "Titanium"].includes(part.eff)) pros.push(`Efficient 80+ ${part.eff}`);
      if (part.eff === "Bronze") cons.push("Basic 80+ Bronze efficiency");
      if (part.watt >= 1000) pros.push(`${part.watt}W — ample headroom for top GPUs`);
      if (part.watt <= 550) cons.push(`${part.watt}W — limited headroom for big builds`);
      break;
    case "case":
      if (part.maxGpu >= 380) pros.push("Fits very long GPUs");
      if (part.maxCool >= 170) pros.push("Room for tall coolers / big radiators");
      if (part.forms.length === 1 && part.forms[0] === "ITX") cons.push("ITX-only — tight build, limited clearance");
      break;
    case "cooler":
      if (part.type === "aio") pros.push("AIO liquid — strong, quiet cooling");
      if (part.tdpRating >= 250) pros.push(`Handles up to ${part.tdpRating}W CPUs`);
      if (part.type === "air" && part.tdpRating <= 95) cons.push("Limited cooling — not for hot CPUs");
      if (part.type === "air" && part.height >= 160) cons.push(`${part.height}mm tall — check case clearance`);
      break;
    default:
      break;
  }

  if (pros.length === 0) pros.push("Gets the job done for the price");
  if (cons.length === 0) cons.push("No notable downsides for this build");
  return { pros, cons };
}

function PartAsk({ part, cat, useCase, budget, parts, isOnline }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // { role:'user'|'assistant', text, err? }
  const [loading, setLoading] = useState(false);
  const ask = async () => {
    const q = input.trim();
    if (!q || loading) return;
    const history = [...messages, { role: "user", text: q }];
    setMessages([...history, { role: "assistant", text: "" }]);
    setInput("");
    setLoading(true);
    const ucLabel = useCase ? tUC(useCase) : "unspecified";
    const buildLines = parts ? CATEGORY_ORDER.filter((c) => parts[c]).map((c) => `${CAT_META[c].label}: ${parts[c].name} ($${parts[c].price})`).join("; ") : "";
    const system =
      "You are the built-in AI assistant for FORGEAPC, a PC-part-picker app. " +
      "Your name and model identity is \"Opus 4.8\" by Anthropic (Claude). If anyone asks what model or AI you are, always say you are Opus 4.8 by Anthropic. Never mention Haiku, Sonnet, or any other model name. " +
      "Answer the user's question about ONE specific part, in the context of their full build, use case and budget. The conversation may have follow-up questions — keep your earlier answers in mind. " +
      "Keep answers short and practical — usually 2-4 sentences. Use a short bullet list only if it genuinely helps. No fluff or filler. " +
      "Context: as of mid-2026 a severe AI-driven memory/storage shortage makes RAM and SSDs very expensive (64GB DDR5 ~$850, 32GB ~$470, 1TB SSD ~$165). DDR5-6000 CL30 is the value sweet spot; motherboards above ~$250 are usually overkill.\n\n" +
      `The part in question: ${CAT_META[cat].label} — ${part.name} ($${part.price}). Use case: ${ucLabel}. Budget: ${fmt(budget)}. Full build: ${buildLines || "not assembled yet"}.`;
    const payload = history.map((m) => ({ role: m.role, content: m.text }));
    try {
      await streamChat({ system, messages: payload }, (full) => {
        setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", text: full }; return c; });
      });
    } catch (e) {
      setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", text: "Could not reach the assistant — please try again.", err: true }; return c; });
    } finally {
      setLoading(false);
    }
  };
  if (!open) {
    return (
      <button className="rf-ask-part-btn" onClick={() => setOpen(true)}>
        <Sparkles size={13} /> Ask AI about this part
      </button>
    );
  }
  if (!isOnline) {
    return (
      <div className="rf-ask-inline">
        <div className="rf-offline-msg" style={{marginTop:"6px"}}>AI is unavailable offline. Connect to the internet to ask questions about this part.</div>
      </div>
    );
  }
  return (
    <div className="rf-ask-inline">
      {messages.length > 0 && (
        <div className="rf-ask-thread">
          {messages.map((m, i) => {
            const thinking = m.role === "assistant" && !m.text && loading && i === messages.length - 1;
            return (
              <div key={i} className={"rf-ask-msg " + m.role + (m.err ? " rf-ask-err" : "") + (thinking ? " rf-ask-think" : "")}>
                {m.text || (thinking ? "Thinking…" : "")}
              </div>
            );
          })}
        </div>
      )}
      <div className="rf-ask-row">
        <input className="rf-ask-input" value={input} autoFocus placeholder="Ask anything about this part…"
          onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") ask(); }} />
        <button className="rf-ask-send" onClick={ask} disabled={loading || !input.trim()}>{loading ? "…" : "Ask"}</button>
      </div>
    </div>
  );
}

function InfoPanel({ cat, part, band, status, useCase, compact, incompatible, enableAsk, budget, parts, isOnline }) {
  const facts = partFacts(cat, part);
  const { pros, cons } = partProsCons(cat, part, band, status, useCase);
  const allCons = incompatible ? ["Not compatible with your current build", ...cons] : cons;
  const strong = (c) => c === "Over budget" || c === "Not compatible with your current build";
  return (
    <div className={"rf-info rf-slidein" + (compact ? " compact" : "")}>
      <div className="rf-info-specs">
        <div className="rf-info-h">SPECS</div>
        <div className="rf-info-facts">{facts.map((f, i) => <span key={i} className="rf-fact">{f}</span>)}</div>
      </div>
      <div className="rf-pc-head"><Sparkles size={12} /> AI PROS &amp; CONS <span className="rf-hybrid">auto</span></div>
      <div className="rf-pc-grid">
        <div>
          <div className="rf-pc-h pros">{t("pros")}</div>
          <ul className="rf-pc-list">
            {pros.map((p, i) => <li key={i} className="rf-pc pro"><Check size={13} /> {p}</li>)}
          </ul>
        </div>
        <div>
          <div className="rf-pc-h cons">{t("cons")}</div>
          <ul className="rf-pc-list">
            {allCons.map((c, i) => (
              <li key={i} className={"rf-pc con" + (strong(c) ? " strong" : "")}><X size={13} /> {c}</li>
            ))}
          </ul>
        </div>
      </div>
      {enableAsk && <PartAsk part={part} cat={cat} useCase={useCase} budget={budget} parts={parts} isOnline={isOnline} />}
    </div>
  );
}

/* ----------------------------- PART PICKER DRAWER ----------------------------- */
function Picker({ cat, current, useCase, budget, parts, onClose, onPick }) {
  const Meta = CAT_META[cat];
  const band = (budget * USE_CASES[useCase].alloc[cat]) / 100;
  const [openId, setOpenId] = useState(null);      // variant id with "More info" open
  const [openModel, setOpenModel] = useState(null); // model group expanded to variants
  const [q, setQ] = useState(""); // search filter

  const models = useMemo(() => {
    const rest = { ...parts };
    delete rest[cat];
    const baseIssues = checkCompat(rest).issues.length;
    const scored = CATALOG[cat].map((p) => {
      const res = checkCompat({ ...rest, [cat]: p });
      const adds = res.issues.length > baseIssues;
      return {
        ...p,
        _score: adds ? 0 : partScore({ ...p, cat }, band, useCase),
        _status: budgetStatus(p.price, band),
        _compat: !adds,
        _issues: res.issues,
      };
    });
    const groups = {};
    for (const v of scored) {
      const key = v.model || v.name;
      (groups[key] = groups[key] || []).push(v);
    }
    const list = Object.entries(groups).map(([model, variants]) => {
      variants.sort((a, b) => (a._status === "over" ? 1 : 0) - (b._status === "over" ? 1 : 0) || b._score - a._score || a.price - b.price);
      const prices = variants.map((v) => v.price);
      const rep = variants[0];
      return {
        model,
        variants,
        rep,
        single: variants.length === 1,
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        score: rep._score,
        _over: budgetStatus(Math.min(...prices), band) === "over",
        compat: variants.some((v) => v._compat),
        hasCurrent: current && variants.some((v) => v.id === current.id),
      };
    });
    list.sort((a, b) => (a._over ? 1 : 0) - (b._over ? 1 : 0) || b.score - a.score || a.minPrice - b.minPrice);
    return list;
  }, [cat, parts, band, useCase, current]);

  // search filter: match model, brand, or any variant name/label
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return models;
    const toks = s.split(/\s+/);
    return models.filter((g) => {
      const hay = (g.model + " " + g.variants.map((v) => `${v.brand} ${v.name} ${v.variantLabel || ""} ${v.model || ""}`).join(" ")).toLowerCase();
      return toks.every((tk) => hay.includes(tk));
    });
  }, [models, q]);

  const VariantActions = ({ v }) => {
    const open = openId === v.id;
    const isCur = current && current.id === v.id;
    const oos = partOOS(v);
    return (
      <>
        <div className="rf-pick-actions">
          <button className="rf-chip-btn" onClick={() => setOpenId(open ? null : v.id)}>
            {open ? <ChevronLeft size={13} style={{ transform: "rotate(90deg)" }} /> : <Sparkles size={13} />}
            {open ? t("hideInfo") : t("moreInfo")}
          </button>
          {oos ? (
            <button className="rf-chip-btn oos" disabled>{t("outOfStock")}</button>
          ) : (
            <button className="rf-chip-btn primary" onClick={() => onPick(v)}>{isCur ? t("selected") : t("select")}</button>
          )}
        </div>
        {open && <InfoPanel cat={cat} part={v} band={band} status={v._status} useCase={useCase} compact incompatible={!v._compat} />}
      </>
    );
  };

  return (
    <div className="rf-drawer-wrap" onClick={onClose}>
      <div className="rf-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="rf-drawer-head">
          <div>
            <div className="rf-eyebrow"><Meta.Icon size={13} /> {t("chooseA")} {tCat(cat).toUpperCase()}</div>
            <div className="rf-muted rf-sm">{q.trim() ? `${shown.length} of ${CATALOG[cat].length}` : CATALOG[cat].length} options · sorted by your match score · budget slice {fmt(band)}</div>
          </div>
          <button className="rf-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="rf-drawer-search">
          <Search size={15} />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${tCat(cat).toLowerCase()}…`} spellCheck={false} />
          {q && <button className="rf-search-clear" onClick={() => setQ("")} aria-label="Clear"><X size={14} /></button>}
        </div>
        <div className="rf-drawer-list">
          {shown.length === 0 && <div className="rf-pick-empty">No {tCat(cat).toLowerCase()} matches "{q}".</div>}
          {shown.map((g, gi) => {
            const expanded = openModel === g.model;
            const _lp = g.variants.filter((v) => !partOOS(v)).map((v) => v.price);
            const priceLabel = _lp.length ? (Math.min(..._lp) === Math.max(..._lp) ? fmt(Math.min(..._lp)) : `${fmt(Math.min(..._lp))}–${fmt(Math.max(..._lp))}`) : t("outOfStock");
            const showDivider = gi > 0 && g._over && !shown[gi - 1]._over;
            return (
              <React.Fragment key={g.model}>
                {showDivider && <div className="rf-pick-divider"><span>{t("overBudgetCat", { x: tCat(cat).toLowerCase() })}</span></div>}
              <div className={"rf-pick" + (g.hasCurrent ? " current" : "") + (g._over ? " over" : "")}>
                <div
                  className={"rf-pick-row" + (g.single ? "" : " rf-clickable")}
                  onClick={g.single ? undefined : () => setOpenModel(expanded ? null : g.model)}
                >
                  <div className="rf-pick-score" style={{ borderColor: scoreColor(g.score), color: scoreColor(g.score) }}>{g.score}</div>
                  {g.rep.img && (
                    <a href={g.rep.url || "#"} target="_blank" rel="noopener noreferrer" className="rf-pick-img-link" onClick={(e) => e.stopPropagation()} title="View product page">
                      <img src={g.rep.img} alt={g.model} className="rf-pick-img" loading="lazy" />
                    </a>
                  )}
                  <div className="rf-pick-info">
                    <div className="rf-pick-name">
                      {g.model}
                      {!g.single && <span className="rf-variant-count">{g.variants.length} models</span>}
                      {g.hasCurrent && <span className="rf-cur-tag">current</span>}
                    </div>
                    <div className="rf-pick-facts">{partFacts(cat, g.rep).slice(0, 3).join(" · ")}</div>
                    {!g.compat && <div className="rf-pick-warn"><AlertTriangle size={12} /> {g.rep._issues[0]}</div>}
                  </div>
                  <div className="rf-pick-right">
                    <div className={"rf-part-price " + (g.single ? g.rep._status : "")}>{priceLabel}</div>
                    {g.compat ? <ShieldCheck size={14} className="rf-compat-ok" /> : <ShieldAlert size={14} className="rf-compat-bad" />}
                  </div>
                </div>

                {g.single ? (
                  <VariantActions v={g.rep} />
                ) : (
                  <div className="rf-pick-actions">
                    <button className="rf-chip-btn" onClick={() => setOpenModel(expanded ? null : g.model)}>
                      <ChevronLeft size={13} style={{ transform: expanded ? "rotate(90deg)" : "rotate(-90deg)" }} />
                      {expanded ? "Hide models" : `Show ${g.variants.length} models`}
                    </button>
                  </div>
                )}

                {!g.single && expanded && (
                  <div className="rf-variants">
                    {g.variants.map((v) => (
                      <div key={v.id} className={"rf-variant" + (current && current.id === v.id ? " current" : "")}>
                        <div className="rf-variant-row">
                          <div className="rf-pick-score sm" style={{ borderColor: scoreColor(v._score), color: scoreColor(v._score) }}>{v._score}</div>
                          {v.img && (
                            <a href={v.url || "#"} target="_blank" rel="noopener noreferrer" className="rf-pick-img-link" onClick={(e) => e.stopPropagation()} title="View product page">
                              <img src={v.img} alt={v.variantLabel || v.brand} className="rf-pick-img sm" loading="lazy" />
                            </a>
                          )}
                          <div className="rf-variant-name">{v.variantLabel || v.brand}</div>
                          <div className="rf-variant-right">
                            <span className={"rf-part-price " + v._status}>{partOOS(v) ? "—" : fmt(v.price)}</span>
                            {v._status === "over" && <span className="rf-flag over">OVER</span>}
                            {!v._compat && <ShieldAlert size={13} className="rf-compat-bad" />}
                          </div>
                        </div>
                        <VariantActions v={v} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- AI ASSISTANT ----------------------------- */
const SUGGESTIONS = [
  "Is my build balanced?",
  "What should I upgrade first?",
  "Best value GPU for my budget?",
  "Why is RAM so expensive right now?",
];

// Try the strongest model first; fall back if the environment doesn't allow it.
const ASSISTANT_MODELS = ["claude-opus-4-8", "claude-sonnet-4-6", "claude-sonnet-4-20250514"];
const CHAT_URL = "/api/chat"; // your serverless function that holds the Anthropic key

async function streamChat({ system, messages }, onDelta) {
  // 1) Deployed site: our own backend answers and keeps the API key server-side.
  try {
    const res = await fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, messages }),
    });
    if (res.ok) {
      const data = await res.json();
      const text = (data && data.text ? data.text : "").trim();
      if (text) { onDelta(text); return text; } // smooth typewriter reveals it
    }
  } catch (e) {
    /* no backend reachable (e.g. the Claude preview) — fall through to the direct call */
  }

  // 2) Fallback: call Anthropic directly (works inside the Claude preview).
  let lastErr;
  for (const model of ASSISTANT_MODELS) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, max_tokens: 600, system, stream: true, messages }),
      });
      if (!res.ok || !res.body) throw new Error("status " + res.status);
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "", raw = "", acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        raw += chunk; buf += chunk;
        const lines = buf.split("\n");
        buf = lines.pop();
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const p = t.slice(5).trim();
          if (!p || p === "[DONE]") continue;
          try {
            const evt = JSON.parse(p);
            if (evt.type === "content_block_delta" && evt.delta && evt.delta.type === "text_delta") {
              acc += evt.delta.text;
              onDelta(acc);
            }
          } catch (e) {}
        }
      }
      if (!acc) {
        try {
          const data = JSON.parse(raw);
          const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
          if (text) { acc = text; onDelta(acc); }
        } catch (e) {}
      }
      if (acc) return acc;
      lastErr = new Error("empty response");
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("request failed");
}

function Assistant({ open, onClose, useCase, budget, parts, isOnline }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);
  const targetRef = useRef("");   // full text received from the stream so far
  const shownRef = useRef(0);     // chars currently revealed
  const doneRef = useRef(false);  // network stream finished
  const rafRef = useRef(0);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Reveal buffered text at a steady, smooth pace regardless of network bursts.
  const tick = () => {
    const target = targetRef.current;
    if (shownRef.current < target.length) {
      const remaining = target.length - shownRef.current;
      const step = Math.max(2, Math.min(4, Math.ceil(remaining / 25))); // steady, smooth cadence
      shownRef.current = Math.min(target.length, shownRef.current + step);
      const shown = target.slice(0, shownRef.current);
      setMessages((m) => {
        const c = [...m];
        c[c.length - 1] = { role: "assistant", text: shown };
        return c;
      });
    }
    if (doneRef.current && shownRef.current >= target.length) {
      setStreaming(false);
      rafRef.current = 0;
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  const buildContext = () => {
    const hasBuild = parts && Object.keys(parts).some((k) => parts[k]);
    if (!hasBuild) return "The user hasn't assembled a build yet.";
    const ucLabel = useCase ? USE_CASES[useCase].label : "unspecified";
    const lines = CATEGORY_ORDER.filter((c) => parts[c]).map(
      (c) => `- ${CAT_META[c].label}: ${parts[c].name} ($${parts[c].price})`
    );
    const total = CATEGORY_ORDER.reduce((s, c) => s + (parts[c]?.price || 0), 0);
    let extra = "";
    if (useCase) {
      const a = analyzeBuild(parts, useCase, budget);
      extra =
        `Performance score ${a.score}/1000, price-to-performance ${a.ppScore}/100. ` +
        `Total $${total} of a $${budget} budget. ` +
        `Compatibility: ${a.compat.pass ? "all checks pass" : a.compat.issues.join("; ")}.`;
    }
    return `Use case: ${ucLabel}. Budget: $${budget}.\nParts:\n${lines.join("\n")}\n${extra}`;
  };

  const send = async (preset) => {
    const q = (preset ?? input).trim();
    if (!q || loading || streaming) return;
    const next = [...messages, { role: "user", text: q }];
    const payload = next.map((m) => ({ role: m.role, content: m.text }));
    setMessages([...next, { role: "assistant", text: "" }]);
    setInput("");
    setLoading(true);
    setStreaming(true);
    setError(null);
    targetRef.current = "";
    shownRef.current = 0;
    doneRef.current = false;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    const system =
      "You are the built-in AI assistant for FORGEAPC, a PC-part-picker app. " +
      "Your name and model identity is \"Opus 4.8\" by Anthropic (Claude). If anyone asks what model or AI you are, always say you are Opus 4.8 by Anthropic. Never mention Haiku, Sonnet, or any other model name. " +
      "Help with the user's build: components, compatibility, bottlenecks, and which parts fit their needs and budget. " +
      "Keep answers short and practical — usually 2-4 sentences. Use a short bullet list only if it genuinely helps. No fluff or filler. " +
      "Context: as of mid-2026 a severe AI-driven memory/storage shortage makes RAM and SSDs very expensive (64GB DDR5 ~$850, 32GB ~$470, 1TB SSD ~$165). " +
      "DDR5-6000 CL30 is the value sweet spot; 6400/7200 is poor value; motherboards above ~$250 are usually overkill. Factor this in.\n\n" +
      "The user's current build:\n" +
      buildContext();
    try {
      await streamChat({ system, messages: payload }, (full) => { targetRef.current = full; });
      doneRef.current = true; // reveal loop will finish the remaining buffered text, then stop
    } catch (e) {
      doneRef.current = true;
      cancelAnimationFrame(rafRef.current);
      setStreaming(false);
      setError("Couldn't reach the assistant. Please try again.");
      setMessages((m) => (m.length && m[m.length - 1].role === "assistant" && !m[m.length - 1].text ? m.slice(0, -1) : m));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="rf-assistant">
      <div className="rf-asst-head">
        <div className="rf-asst-title">
          <div className="rf-asst-avatar"><Bot size={16} /></div>
          <span>AI Assistant <span className="rf-asst-model">Opus 4.8</span></span>
        </div>
        <button className="rf-icon-btn" onClick={onClose}><X size={18} /></button>
      </div>

      <div className="rf-asst-list" ref={listRef}>
        {messages.length === 0 && (
          <div className="rf-asst-welcome">
            <div className="rf-asst-avatar big"><Sparkles size={20} /></div>
            <p>Ask me anything about your build or PC parts in general — I can see your current rig.</p>
            <div className="rf-asst-suggest">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="rf-asst-chip" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => {
          const isStreamingMsg = streaming && i === messages.length - 1 && m.role === "assistant";
          return (
            <div key={i} className={"rf-msg " + m.role}>
              {m.role === "assistant" && <div className="rf-asst-avatar sm"><Bot size={13} /></div>}
              <div className="rf-bubble">
                {m.text ? (
                  <>{m.text}{isStreamingMsg && <span className="rf-cursor" />}</>
                ) : isStreamingMsg ? (
                  <span className="rf-typing"><span></span><span></span><span></span></span>
                ) : null}
              </div>
            </div>
          );
        })}
        {error && <div className="rf-asst-error">{error}</div>}
        {!isOnline && <div className="rf-asst-offline">You are offline — AI is unavailable. Reconnect to use the assistant.</div>}
      </div>

      <div className="rf-asst-input">
        <input
          value={input}
          placeholder={isOnline ? "Ask about your build…" : "Offline — AI unavailable"}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && isOnline && send()}
          disabled={!isOnline}
        />
        <button className="rf-asst-send" onClick={() => send()} disabled={loading || streaming || !input.trim() || !isOnline}><Send size={16} /></button>
      </div>
    </div>
  );
}

/* ----------------------------- STYLES ----------------------------- */
// Styles are in src/styles/forgeapc.css — imported via src/index.css
function StyleBlock() { return null; }