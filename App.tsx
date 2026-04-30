import React, { useState, createContext, useContext } from "react";
import Layout from "./components/Layout";
import KnowledgeMap from "./components/KnowledgeMap";
import CommunityForum from "./components/CommunityForum";
import AIAssistant from "./components/AIAssistant";
import AdminDashboard from "./components/AdminDashboard";
import { AppSection, ThemeConfig, UserRole } from "./types";

export const ThemeContext = createContext<{
  config: ThemeConfig;
  updateConfig: (updates: Partial<ThemeConfig>) => void;
}>({
  config: {
    primaryColor: "#2563eb",
    borderRadius: "3xl",
    showPoints: true,
    compactMode: false,
    siteName: "PetroPro",
    activeRole: "ADMIN",
    layoutDensity: "relaxed",
    isEditMode: false,
  },
  updateConfig: () => {},
});

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(
    AppSection.KnowledgeMap,
  );
  const [config, setConfig] = useState<ThemeConfig>({
    primaryColor: "#2563eb",
    borderRadius: "3xl",
    showPoints: true,
    compactMode: false,
    siteName: "PetroPro",
    activeRole: "ADMIN",
    layoutDensity: "relaxed",
    isEditMode: false,
  });

  const updateConfig = (updates: Partial<ThemeConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const renderContent = () => {
    switch (activeSection) {
      case AppSection.KnowledgeMap:
        return <KnowledgeMap setActiveSection={setActiveSection} />;
      case AppSection.Community:
        return <CommunityForum />;
      case AppSection.AIAssistant:
        return <AIAssistant />;
      case AppSection.KnowledgeAdmin:
      case AppSection.IssueAdmin:
      case AppSection.QAAdmin:
      case AppSection.LLMAdmin:
        return <AdminDashboard activeSection={activeSection} />;
      default:
        return <KnowledgeMap />;
    }
  };

  return (
    <ThemeContext.Provider value={{ config, updateConfig }}>
      <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
        {renderContent()}
      </Layout>
    </ThemeContext.Provider>
  );
};

export default App;
