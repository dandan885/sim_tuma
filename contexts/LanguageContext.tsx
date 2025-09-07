import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'rw' | 'fr' | 'sw';

export interface Translations {
  // Common
  loading: string;
  error: string;
  success: string;
  cancel: string;
  continue: string;
  back: string;
  save: string;
  delete: string;
  edit: string;
  
  // Authentication
  welcome: string;
  signIn: string;
  signUp: string;
  logout: string;
  phoneNumber: string;
  password: string;
  pin: string;
  enterPin: string;
  forgotPin: string;
  
  // Navigation
  wallet: string;
  send: string;
  chat: string;
  bills: string;
  profile: string;
  
  // Wallet
  totalBalance: string;
  sendMoney: string;
  receiveMoney: string;
  payBills: string;
  recentTransactions: string;
  
  // Chat
  messages: string;
  newChat: string;
  searchContacts: string;
  typeMessage: string;
  
  // Profile
  personalDetails: string;
  accountSettings: string;
  language: string;
  theme: string;
  notifications: string;
  
  // Transactions
  sent: string;
  received: string;
  pending: string;
  completed: string;
  failed: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    continue: 'Continue',
    back: 'Back',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    
    // Authentication
    welcome: 'Welcome',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    logout: 'Logout',
    phoneNumber: 'Phone Number',
    password: 'Password',
    pin: 'PIN',
    enterPin: 'Enter PIN',
    forgotPin: 'Forgot PIN?',
    
    // Navigation
    wallet: 'Wallet',
    send: 'Send',
    chat: 'Chat',
    bills: 'Bills',
    profile: 'Profile',
    
    // Wallet
    totalBalance: 'Total Balance',
    sendMoney: 'Send Money',
    receiveMoney: 'Receive Money',
    payBills: 'Pay Bills',
    recentTransactions: 'Recent Transactions',
    
    // Chat
    messages: 'Messages',
    newChat: 'New Chat',
    searchContacts: 'Search Contacts',
    typeMessage: 'Type a message...',
    
    // Profile
    personalDetails: 'Personal Details',
    accountSettings: 'Account Settings',
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    
    // Transactions
    sent: 'Sent',
    received: 'Received',
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
  },
  rw: {
    // Common
    loading: 'Gutegereza...',
    error: 'Ikibazo',
    success: 'Byarangiye',
    cancel: 'Hagarika',
    continue: 'Komeza',
    back: 'Subira',
    save: 'Bika',
    delete: 'Siba',
    edit: 'Hindura',
    
    // Authentication
    welcome: 'Murakaza neza',
    signIn: 'Injira',
    signUp: 'Iyandikishe',
    logout: 'Sohoka',
    phoneNumber: 'Nomero ya Telefoni',
    password: 'Ijambo ry\'ibanga',
    pin: 'PIN',
    enterPin: 'Andika PIN',
    forgotPin: 'Wibagiwe PIN?',
    
    // Navigation
    wallet: 'Amafaranga',
    send: 'Kohereza',
    chat: 'Ubutumwa',
    bills: 'Fagitire',
    profile: 'Umwirondoro',
    
    // Wallet
    totalBalance: 'Amafaranga Yose',
    sendMoney: 'Kohereza Amafaranga',
    receiveMoney: 'Kwakira Amafaranga',
    payBills: 'Kwishyura Fagitire',
    recentTransactions: 'Ibikorwa Bya Vuba',
    
    // Chat
    messages: 'Ubutumwa',
    newChat: 'Ubutumwa Bushya',
    searchContacts: 'Shakisha Abo mubana',
    typeMessage: 'Andika ubutumwa...',
    
    // Profile
    personalDetails: 'Amakuru Bwite',
    accountSettings: 'Igenamiterere rya Konti',
    language: 'Ururimi',
    theme: 'Imiterere',
    notifications: 'Ubutumwa',
    
    // Transactions
    sent: 'Byoherejwe',
    received: 'Byakiriwe',
    pending: 'Bitegereje',
    completed: 'Byarangiye',
    failed: 'Byanze',
  },
  fr: {
    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    cancel: 'Annuler',
    continue: 'Continuer',
    back: 'Retour',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    
    // Authentication
    welcome: 'Bienvenue',
    signIn: 'Se connecter',
    signUp: 'S\'inscrire',
    logout: 'Déconnexion',
    phoneNumber: 'Numéro de téléphone',
    password: 'Mot de passe',
    pin: 'PIN',
    enterPin: 'Entrer le PIN',
    forgotPin: 'PIN oublié?',
    
    // Navigation
    wallet: 'Portefeuille',
    send: 'Envoyer',
    chat: 'Chat',
    bills: 'Factures',
    profile: 'Profil',
    
    // Wallet
    totalBalance: 'Solde Total',
    sendMoney: 'Envoyer de l\'argent',
    receiveMoney: 'Recevoir de l\'argent',
    payBills: 'Payer les factures',
    recentTransactions: 'Transactions récentes',
    
    // Chat
    messages: 'Messages',
    newChat: 'Nouveau chat',
    searchContacts: 'Rechercher contacts',
    typeMessage: 'Tapez un message...',
    
    // Profile
    personalDetails: 'Détails personnels',
    accountSettings: 'Paramètres du compte',
    language: 'Langue',
    theme: 'Thème',
    notifications: 'Notifications',
    
    // Transactions
    sent: 'Envoyé',
    received: 'Reçu',
    pending: 'En attente',
    completed: 'Terminé',
    failed: 'Échoué',
  },
  sw: {
    // Common
    loading: 'Inapakia...',
    error: 'Hitilafu',
    success: 'Mafanikio',
    cancel: 'Ghairi',
    continue: 'Endelea',
    back: 'Rudi',
    save: 'Hifadhi',
    delete: 'Futa',
    edit: 'Hariri',
    
    // Authentication
    welcome: 'Karibu',
    signIn: 'Ingia',
    signUp: 'Jisajili',
    logout: 'Toka',
    phoneNumber: 'Nambari ya Simu',
    password: 'Nenosiri',
    pin: 'PIN',
    enterPin: 'Ingiza PIN',
    forgotPin: 'Umesahau PIN?',
    
    // Navigation
    wallet: 'Mkoba',
    send: 'Tuma',
    chat: 'Mazungumzo',
    bills: 'Bili',
    profile: 'Wasifu',
    
    // Wallet
    totalBalance: 'Jumla ya Salio',
    sendMoney: 'Tuma Pesa',
    receiveMoney: 'Pokea Pesa',
    payBills: 'Lipa Bili',
    recentTransactions: 'Miamala ya Hivi Karibuni',
    
    // Chat
    messages: 'Ujumbe',
    newChat: 'Mazungumzo Mapya',
    searchContacts: 'Tafuta Anwani',
    typeMessage: 'Andika ujumbe...',
    
    // Profile
    personalDetails: 'Maelezo ya Kibinafsi',
    accountSettings: 'Mipangilio ya Akaunti',
    language: 'Lugha',
    theme: 'Mandhari',
    notifications: 'Arifa',
    
    // Transactions
    sent: 'Imetumwa',
    received: 'Imepokelewa',
    pending: 'Inasubiri',
    completed: 'Imekamilika',
    failed: 'Imeshindwa',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
  availableLanguages: { code: Language; name: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const availableLanguages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'rw' as Language, name: 'Kinyarwanda', flag: '🇷🇼' },
    { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
    { code: 'sw' as Language, name: 'Kiswahili', flag: '🇹🇿' },
  ];

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language');
      if (savedLanguage && ['en', 'rw', 'fr', 'sw'].includes(savedLanguage)) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    }
  };

  const setLanguage = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem('app_language', newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        availableLanguages,
      }}>
      {children}
    </LanguageContext.Provider>
  );
};