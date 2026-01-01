import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    platform: 'AquaVolt Intelligence Platform',
    title: 'Intelligent Aquaculture',
    titleHighlight: 'Monitoring & Optimization',
    description: 'Intelligent Aquaculture Monitoring & Optimization',
    activeFarms: 'Active Farms',
    monitoring: 'Monitoring',
    aiPowered: 'AI Powered',
    chooseFarm: 'Choose Your Farm',
    addNewFarm: 'Add New Farm',
    systemStatus: 'System Status',
    optimal: 'Optimal',
    healthScore: 'Health Score',
    openDashboard: 'Open Dashboard',
    online: 'ONLINE',
    footer1: 'Aquavolt © 2025 • Oman Vision 2040 Blue Economy Initiative',
    footer2: 'AI-Powered Sustainable Aquaculture • Simulation Dashboard',
    changeFarm: 'Change Farm',
    dashboard: 'Dashboard',
    aiInsights: 'AI Insights',
    visionDetection: 'Vision Detection',
    tagline: 'Real-time water quality monitoring powered by AI. Optimize feeding schedules, automate aeration systems, and maximize yield with intelligent insights for sustainable marine aquaculture.',
    temperature: 'Temperature',
    phLevel: 'pH Level',
    dissolvedO2: 'Dissolved O₂',
    turbidity: 'Turbidity',
    ammoniaNH3: 'Ammonia NH₃',
    aiAeratorRecommendation: 'AI Aerator Recommendation',
    turnAeratorOn: 'TURN AERATOR ON',
    turnAeratorOff: 'TURN AERATOR OFF',
    maintainCurrentState: 'MAINTAIN CURRENT STATE',
    high: 'HIGH',
    medium: 'MEDIUM',
    low: 'LOW',
    confidence: 'Confidence',
    reasoning: 'Reasoning',
    manualControl: 'Manual Control',
    aeratorStatus: 'Aerator Status',
    active: 'ACTIVE',
    inactive: 'INACTIVE',
    activate: 'Activate',
    deactivate: 'Deactivate',
    currentDraw: 'Current Draw',
    activeAlerts: 'Active Alerts',
    allSystemsNominal: 'All systems nominal',
    expectedImpact: 'Expected Impact',
    aiPoweredInsights: 'AI-Powered Insights',
    advancedPredictiveAnalytics: 'Advanced predictive analytics and correlation analysis',
    predictiveForecasting: 'Predictive Forecasting',
    modelConfidence: 'Model Confidence',
    oneHourAhead: '(1h ahead)',
    fromCurrent: 'from current',
    nextFeedingWindow: 'Next Feeding Window',
    optimalIn2Hours: 'Optimal in 2 hours',
    basedOnPatterns: 'Based on DO, temperature, and activity patterns',
    tempVsDOCorrelation: 'Temperature vs DO Correlation',
    correlationCoefficient: 'Correlation Coefficient',
    strongNegativeCorrelation: 'Strong negative correlation (expected behavior)',
    advancedAeratorIntelligence: 'Advanced Aerator Intelligence',
    aiRecommendation: 'AI Recommendation',
    turnOn: 'TURN ON',
    turnOff: 'TURN OFF',
    maintain: 'MAINTAIN',
    priority: 'Priority',
    currentStatus: 'Current Status',
    aeratorActive: 'AERATOR ACTIVE',
    aeratorInactive: 'AERATOR INACTIVE',
    activateAerator: 'Activate Aerator',
    deactivateAerator: 'Deactivate Aerator',
    aiAnalysisReasoning: 'AI Analysis & Reasoning',
    aiSystemInsights: 'AI System Insights',
    smartFeedingSchedule: 'Smart Feeding Schedule',
    amount: 'Amount',
    expandNetwork: 'Expand your aquaculture monitoring network by adding a new farm location',
    connectedTo: 'Connected to',
  },
  ar: {
    platform: 'منصة AquaVolt الذكية',
    title: 'الاستزراع المائي الذكي',
    titleHighlight: 'المراقبة والتحسين',
    description: 'المراقبة والتحسين الذكي للاستزراع المائي',
    activeFarms: 'المزارع النشطة',
    monitoring: 'المراقبة',
    aiPowered: 'بدعم الذكاء الاصطناعي',
    chooseFarm: 'اختر مزرعتك',
    addNewFarm: 'إضافة مزرعة جديدة',
    systemStatus: 'حالة النظام',
    optimal: 'مثالي',
    healthScore: 'درجة الصحة',
    openDashboard: 'فتح لوحة التحكم',
    online: 'متصل',
    footer1: 'Aquavolt © 2025 • مبادرة رؤية عمان 2040 للاقتصاد الأزرق',
    footer2: 'الاستزراع المائي المستدام بالذكاء الاصطناعي • لوحة محاكاة',
    changeFarm: 'تغيير المزرعة',
    dashboard: 'لوحة التحكم',
    aiInsights: 'رؤى الذكاء الاصطناعي',
    visionDetection: 'الكشف البصري',
    tagline: 'مراقبة جودة المياه في الوقت الفعلي بتقنية الذكاء الاصطناعي. تحسين جداول التغذية، وأتمتة أنظمة التهوية، وزيادة الإنتاج برؤى ذكية للاستزراع المائي البحري المستدام.',
    temperature: 'درجة الحرارة',
    phLevel: 'مستوى الحموضة',
    dissolvedO2: 'الأكسجين الذائب',
    turbidity: 'العكارة',
    ammoniaNH3: 'الأمونيا NH₃',
    aiAeratorRecommendation: 'توصية الذكاء الاصطناعي للمهوي',
    turnAeratorOn: 'تشغيل المهوي',
    turnAeratorOff: 'إيقاف المهوي',
    maintainCurrentState: 'الحفاظ على الحالة الحالية',
    high: 'عالي',
    medium: 'متوسط',
    low: 'منخفض',
    confidence: 'الثقة',
    reasoning: 'التحليل',
    manualControl: 'التحكم اليدوي',
    aeratorStatus: 'حالة المهوي',
    active: 'نشط',
    inactive: 'غير نشط',
    activate: 'تفعيل',
    deactivate: 'إلغاء التفعيل',
    currentDraw: 'الاستهلاك الحالي',
    activeAlerts: 'التنبيهات النشطة',
    allSystemsNominal: 'جميع الأنظمة طبيعية',
    expectedImpact: 'التأثير المتوقع',
    aiPoweredInsights: 'رؤى الذكاء الاصطناعي',
    advancedPredictiveAnalytics: 'التحليلات التنبؤية المتقدمة وتحليل الارتباط',
    predictiveForecasting: 'التنبؤ التوقعي',
    modelConfidence: 'ثقة النموذج',
    oneHourAhead: '(بعد ساعة)',
    fromCurrent: 'من الحالي',
    nextFeedingWindow: 'نافذة التغذية التالية',
    optimalIn2Hours: 'مثالية خلال ساعتين',
    basedOnPatterns: 'بناءً على الأكسجين الذائب ودرجة الحرارة وأنماط النشاط',
    tempVsDOCorrelation: 'ارتباط درجة الحرارة بالأكسجين الذائب',
    correlationCoefficient: 'معامل الارتباط',
    strongNegativeCorrelation: 'ارتباط سلبي قوي (سلوك متوقع)',
    advancedAeratorIntelligence: 'ذكاء المهوي المتقدم',
    aiRecommendation: 'توصية الذكاء الاصطناعي',
    turnOn: 'تشغيل',
    turnOff: 'إيقاف',
    maintain: 'حفظ',
    priority: 'الأولوية',
    currentStatus: 'الحالة الحالية',
    aeratorActive: 'المهوي نشط',
    aeratorInactive: 'المهوي غير نشط',
    activateAerator: 'تفعيل المهوي',
    deactivateAerator: 'إلغاء تفعيل المهوي',
    aiAnalysisReasoning: 'تحليل الذكاء الاصطناعي والتعليل',
    aiSystemInsights: 'رؤى نظام الذكاء الاصطناعي',
    smartFeedingSchedule: 'جدول التغذية الذكي',
    amount: 'الكمية',
    expandNetwork: 'قم بتوسيع شبكة مراقبة الاستزراع المائي الخاصة بك عن طريق إضافة موقع مزرعة جديد',
    connectedTo: 'متصل بـ',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
