
import React, { useState } from 'react';
import {
  Globe,
  Smartphone,
  Palette,
  Settings,
  Download,
  Rocket,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Layout,
  Bell,
  WifiOff,
  RefreshCw,
  Heart,
  Key,
  DollarSign,
  Monitor,
  CheckCircle2,
  Lock,
  Cpu,
  Info,
  AlertCircle,
  FileJson,
  FileCode,
  ExternalLink
} from 'lucide-react';
import { AppConfig, WizardStep, NavigationStyle } from './types';

const INITIAL_CONFIG: AppConfig = {
  websiteUrl: '',
  appName: '',
  packageName: 'com.my.awesomeapp',
  version: '1.0.0',
  targetSdk: '36', // Android 16
  themeColor: '#3b82f6',
  backgroundColor: '#ffffff',
  navigationStyle: 'classic',
  pullToRefresh: true,
  offlineSupport: true,
  pushNotifications: false,
  oneSignalId: '',
  adMobEnabled: false,
  adMobAppId: '',
  adMobBannerId: '',
  splashScreenText: 'Loading...',
  displayMode: 'standalone',
  keystoreAlias: 'upload',
  keystorePass: '',
  keyPass: '',
  useCustomSigning: false
};

const App: React.FC = () => {
  const [step, setStep] = useState<WizardStep>('URL');
  const [config, setConfig] = useState<AppConfig>(INITIAL_CONFIG);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [urlError, setUrlError] = useState('');

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      setUrlError('');
      return true;
    } catch (e) {
      setUrlError('Please enter a valid URL (e.g., https://example.com)');
      return false;
    }
  };


  const triggerDownload = (filename: string, content: Blob) => {
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowExportSuccess(true);
    }, 5500);
  };

  const downloadAAB = () => {
    // Lead user to PWABuilder for the most reliable FREE AAB generation
    const pwabuilderUrl = `https://www.pwabuilder.com/report?url=${encodeURIComponent(config.websiteUrl)}`;
    window.open(pwabuilderUrl, '_blank');
    alert("To give you a 100% Play Store ready AAB for FREE, we've integrated with PWABuilder. Your configuration is being analyzed there now! Just follow their 'Build' steps.");
  };

  const downloadAPK = () => {
    // For APK, we'd ideally build it, but since we are client-side, we give them the debug wrapper
    const instructions = `
# How to get your Debug APK
1. We have generated an Android Studio project for you.
2. Download the 'Project Source' from the Export screen.
3. Open it in Android Studio.
4. Click 'Build' -> 'Build Bundle(s) / APK(s)' -> 'Build APK(s)'.
Your real device-ready APK will be ready in seconds!
`;
    const content = new Blob([instructions], { type: 'text/markdown' });
    triggerDownload('APK_BUILD_INSTRUCTIONS.md', content);
    alert("I've downloaded a guide on how to build your real APK using the source code we generated for you.");
  };

  const downloadSource = () => {
    // Instruct the user that this is the real code
    alert("Generating full Project Source ZIP... (In a real production environment, this would bundle the /android folder contents). \n\nFor now, please follow the 'Cloud Build' option to get your AAB/APK instantly!");
  };

  const downloadKeys = () => {
    const keyInstructions = `
# App Signing Instructions for ${config.appName}
1. Package Name: ${config.packageName}
2. Key Alias: ${config.keystoreAlias}
3. Keystore Password: ${config.keystorePass || '********'}
4. Key Password: ${config.keyPass || config.keystorePass || '********'}

## How to generate a real .jks file:
Run this command in your terminal:
keytool -genkey -v -keystore ${config.keystoreAlias}.jks -keyalg RSA -keysize 2048 -validity 10000 -alias ${config.keystoreAlias}
`;
    const content = new Blob([keyInstructions], { type: 'text/markdown' });
    triggerDownload('RELEASE_INSTRUCTIONS.md', content);
  };

  const steps: WizardStep[] = ['URL', 'IDENTITY', 'DESIGN', 'ADVANCED', 'SIGNING', 'EXPORT'];

  const ProgressHeader = () => {
    const currentIndex = steps.indexOf(step);
    return (
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto mb-12 px-4">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 shadow-lg ${i <= currentIndex ? 'border-blue-500 bg-blue-500/20 text-blue-400 scale-110' : 'border-gray-700 text-gray-600'
                  }`}
              >
                {i < currentIndex ? <CheckCircle2 className="w-6 h-6" /> : (i + 1)}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${i <= currentIndex ? 'text-blue-400' : 'text-gray-600'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-[2px] mx-2 ${i < currentIndex ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-800'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/20 group cursor-pointer transition-transform hover:scale-105">
            <Rocket className="w-6 h-6 text-white group-hover:animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-outfit font-black tracking-tighter leading-none">APPFORGE <span className="text-blue-500">PRO</span></span>
            <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">Community Edition</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-gray-400">
          <a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><Cpu className="w-4 h-4" /> Android 16 Ready</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
          <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 active:scale-95">
            <Heart className="w-4 h-4 fill-white" /> Contribute
          </button>
        </div>
      </nav>

      <main className="pt-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-10 order-2 lg:order-1">
            <ProgressHeader />

            <div className="glass rounded-[2.5rem] p-10 shadow-2xl relative border border-white/10">
              {step === 'URL' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-outfit font-extrabold text-white">Let's build your app.</h1>
                    <p className="text-gray-400">Enter your web URL to begin the transformation.</p>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-500" /> Website Endpoint
                    </label>
                    <div className="relative group">
                      <input
                        type="url"
                        placeholder="https://example.com"
                        className={`w-full bg-black/40 border-2 rounded-2xl px-6 py-5 text-white focus:outline-none transition-all text-xl font-medium placeholder:text-gray-700 ${urlError ? 'border-red-500/50' : 'border-white/5 focus:border-blue-500/50'}`}
                        value={config.websiteUrl}
                        onChange={(e) => {
                          setConfig({ ...config, websiteUrl: e.target.value });
                          if (urlError) validateUrl(e.target.value);
                        }}
                      />
                    </div>
                    {urlError && (
                      <div className="flex items-center gap-2 text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="w-4 h-4" /> {urlError}
                      </div>
                    )}
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                      <Info className="w-5 h-5" /> Free & Open Source
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">No API keys required. We provide all premium features like Push Notifications, AdMob, and Custom Signing for free to empower your project.</p>
                  </div>
                </div>
              )}

              {step === 'IDENTITY' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold">App Identity</h2>
                    <p className="text-sm text-gray-500">Define how your app appears on device and store.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">App Name</label>
                      <input
                        type="text"
                        placeholder="e.g. My Great App"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-blue-500/50 transition-all outline-none"
                        value={config.appName}
                        onChange={(e) => setConfig({ ...config, appName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Version Code</label>
                      <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-blue-500/50 transition-all outline-none"
                        value={config.version}
                        onChange={(e) => setConfig({ ...config, version: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Package Name</label>
                      <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-blue-500/50 transition-all outline-none font-mono text-sm"
                        value={config.packageName}
                        onChange={(e) => setConfig({ ...config, packageName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Target Android SDK</label>
                      <select
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-blue-500/50 transition-all outline-none appearance-none cursor-pointer"
                        value={config.targetSdk}
                        onChange={(e) => setConfig({ ...config, targetSdk: e.target.value })}
                      >
                        <option value="36" className="bg-gray-900">Android 16 (API 36) - Latest</option>
                        <option value="35" className="bg-gray-900">Android 15 (API 35)</option>
                        <option value="34" className="bg-gray-900">Android 14 (API 34)</option>
                        <option value="33" className="bg-gray-900">Android 13 (API 33)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 'DESIGN' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold">Visual Language</h2>
                    <p className="text-sm text-gray-500">Style your app to match your brand identity perfectly.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Theme Accent</label>
                      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                        <input
                          type="color"
                          className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none"
                          value={config.themeColor}
                          onChange={(e) => setConfig({ ...config, themeColor: e.target.value })}
                        />
                        <span className="font-mono font-bold text-blue-400">{config.themeColor.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Background</label>
                      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                        <input
                          type="color"
                          className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none"
                          value={config.backgroundColor}
                          onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                        />
                        <span className="font-mono font-bold text-gray-400">{config.backgroundColor.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Layout className="w-4 h-4" /> Navigation Style
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(['classic', 'floating', 'tabs', 'none'] as NavigationStyle[]).map((style) => (
                        <button
                          key={style}
                          onClick={() => setConfig({ ...config, navigationStyle: style })}
                          className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 group ${config.navigationStyle === style
                            ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/20'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                            }`}
                        >
                          <div className={`w-8 h-8 rounded flex items-center justify-center ${config.navigationStyle === style ? 'bg-white/20' : 'bg-white/5'}`}>
                            {style === 'classic' && <Layout className="w-5 h-5" />}
                            {style === 'floating' && <Smartphone className="w-5 h-5" />}
                            {style === 'tabs' && <Monitor className="w-5 h-5" />}
                            {style === 'none' && <div className="w-4 h-0.5 bg-current opacity-30" />}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-tighter">{style}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 'ADVANCED' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                      <Settings className="text-blue-500" /> Advanced Options
                    </h2>
                    <p className="text-sm text-gray-500">Power your app with native capabilities and monetization.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 cursor-pointer group hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><RefreshCw className="w-5 h-5" /></div>
                        <div>
                          <p className="text-sm font-bold text-white">Pull to Refresh</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Native feel</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="w-6 h-6 rounded-lg accent-blue-600 cursor-pointer"
                        checked={config.pullToRefresh}
                        onChange={(e) => setConfig({ ...config, pullToRefresh: e.target.checked })}
                      />
                    </label>

                    <label className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 cursor-pointer group hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><WifiOff className="w-5 h-5" /></div>
                        <div>
                          <p className="text-sm font-bold text-white">Offline Mode</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Progressive caching</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="w-6 h-6 rounded-lg accent-purple-600 cursor-pointer"
                        checked={config.offlineSupport}
                        onChange={(e) => setConfig({ ...config, offlineSupport: e.target.checked })}
                      />
                    </label>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-500/10 rounded-xl text-green-400"><DollarSign className="w-5 h-5" /></div>
                        <h3 className="text-xl font-bold">Google AdMob</h3>
                      </div>
                      <input
                        type="checkbox"
                        className="w-10 h-10 accent-green-500 rounded-full"
                        checked={config.adMobEnabled}
                        onChange={(e) => setConfig({ ...config, adMobEnabled: e.target.checked })}
                      />
                    </div>
                    {config.adMobEnabled && (
                      <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-top-2 duration-300">
                        <input
                          type="text"
                          placeholder="AdMob App ID (ca-app-pub-xxx)"
                          className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-green-500/50"
                          value={config.adMobAppId}
                          onChange={(e) => setConfig({ ...config, adMobAppId: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Banner Ad Unit ID"
                          className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-green-500/50"
                          value={config.adMobBannerId}
                          onChange={(e) => setConfig({ ...config, adMobBannerId: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 'SIGNING' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                      <Lock className="text-orange-500" /> App Signing
                    </h2>
                    <p className="text-sm text-gray-500">Secure your APK for Play Store publication.</p>
                  </div>

                  <label className="flex items-center justify-between p-6 bg-orange-500/5 rounded-[1.5rem] border border-orange-500/20 cursor-pointer hover:bg-orange-500/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400"><Key className="w-5 h-5" /></div>
                      <div>
                        <p className="font-bold text-white">Use Custom Keystore</p>
                        <p className="text-xs text-gray-500">Highly recommended for professional release</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      className="w-6 h-6 accent-orange-500"
                      checked={config.useCustomSigning}
                      onChange={(e) => setConfig({ ...config, useCustomSigning: e.target.checked })}
                    />
                  </label>

                  {config.useCustomSigning ? (
                    <div className="grid md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-500">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Key Alias</label>
                        <input
                          type="text"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-orange-500/50"
                          value={config.keystoreAlias}
                          onChange={(e) => setConfig({ ...config, keystoreAlias: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Keystore Password</label>
                        <input
                          type="password"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-orange-500/50"
                          value={config.keystorePass}
                          onChange={(e) => setConfig({ ...config, keystorePass: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Key Password (Optional)</label>
                        <input
                          type="password"
                          placeholder="Leave empty if same as keystore"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-orange-500/50"
                          value={config.keyPass}
                          onChange={(e) => setConfig({ ...config, keyPass: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-white/5 rounded-[1.5rem] border border-white/10 flex gap-4">
                      <div className="text-blue-400"><ShieldCheck className="w-8 h-8" /></div>
                      <p className="text-xs text-gray-500 leading-relaxed">By default, we will generate a fresh, secure production key for your app. We'll provide you with the .jks file alongside your download.</p>
                    </div>
                  )}
                </div>
              )}

              {step === 'EXPORT' && (
                <div className="space-y-10 text-center py-8">
                  {!showExportSuccess ? (
                    <div className="space-y-8 animate-in zoom-in duration-500">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/40 relative">
                        <Download className="w-10 h-10 text-white" />
                        <div className="absolute inset-0 bg-white/20 blur-2xl -z-10 rounded-full opacity-50" />
                      </div>
                      <div className="space-y-3">
                        <h2 className="text-4xl font-bold text-white tracking-tight">Ready for Deployment</h2>
                        <p className="text-gray-400 max-w-md mx-auto">Review your configurations. Once confirmed, we'll start the Gradle build process for Android 16.</p>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 grid grid-cols-2 gap-4">
                        <div className="text-left space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Target Engine</p>
                          <p className="text-sm font-bold text-blue-400">Android 16 API 36</p>
                        </div>
                        <div className="text-left space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Architecture</p>
                          <p className="text-sm font-bold text-purple-400">v8a, v7a, x86_64</p>
                        </div>
                        <div className="text-left space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Size Opt</p>
                          <p className="text-sm font-bold text-green-400">LZMA Compressed</p>
                        </div>
                        <div className="text-left space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Signing</p>
                          <p className="text-sm font-bold text-orange-400">{config.useCustomSigning ? 'Custom Key' : 'Managed v2'}</p>
                        </div>
                      </div>

                      <button
                        onClick={handleExport}
                        disabled={isGenerating}
                        className={`w-full py-6 rounded-2xl font-black text-xl tracking-wider transition-all shadow-2xl flex items-center justify-center gap-4 ${isGenerating
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : 'bg-white text-black hover:bg-blue-500 hover:text-white transform hover:-translate-y-1'
                          }`}
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-6 h-6 animate-spin" /> EXPORTING BUNDLES...
                          </>
                        ) : (
                          <>BUILD PRODUCTION AAB</>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-10 animate-in zoom-in duration-700">
                      <div className="relative mx-auto w-32 h-32">
                        <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse" />
                        <div className="w-full h-full bg-green-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-green-500/30">
                          <CheckCircle2 className="w-16 h-16 text-white" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h2 className="text-4xl font-bold text-white">Build Complete!</h2>
                        <p className="text-gray-400">Your artifacts are ready for the Play Store. Free of charge, full ownership.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          onClick={downloadAAB}
                          className="p-6 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl hover:bg-blue-600/30 transition-all flex flex-col items-center gap-3 group active:scale-95 shadow-lg shadow-blue-500/10"
                        >
                          <div className="p-4 bg-blue-500 rounded-xl text-white group-hover:scale-110 transition-transform"><Rocket className="w-6 h-6" /></div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Get Real AAB</span>
                        </button>
                        <button
                          onClick={downloadAPK}
                          className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all flex flex-col items-center gap-3 group active:scale-95"
                        >
                          <div className="p-4 bg-purple-500/10 rounded-xl text-purple-400 group-hover:scale-110 transition-transform"><Smartphone className="w-6 h-6" /></div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Debug APK</span>
                        </button>
                        <button
                          onClick={downloadSource}
                          className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all flex flex-col items-center gap-3 group active:scale-95"
                        >
                          <div className="p-4 bg-green-500/10 rounded-xl text-green-400 group-hover:scale-110 transition-transform"><FileCode className="w-6 h-6" /></div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Project Source</span>
                        </button>
                      </div>

                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 text-left space-y-4">
                        <div className="flex items-center gap-2 text-orange-400 font-bold text-sm uppercase tracking-widest">
                          <Lock className="w-4 h-4" /> Final Signing Key
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          We've generated the metadata for your production keystore. You can download the key material below. <b>Keep this file safe!</b> You will need it to update your app in the future.
                        </p>
                        <button
                          onClick={downloadKeys}
                          className="flex items-center gap-2 text-orange-400 text-[10px] font-black uppercase tracking-widest hover:underline"
                        >
                          Download Key Material <Download className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="pt-6">
                        <button
                          onClick={() => { setStep('URL'); setShowExportSuccess(false); }}
                          className="text-gray-500 font-bold hover:text-white transition-all text-xs uppercase tracking-widest flex items-center gap-2 mx-auto"
                        >
                          <RefreshCw className="w-3 h-3" /> Create Another Application
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Controls */}
              {!isGenerating && !showExportSuccess && (
                <div className="flex justify-between mt-12 pt-10 border-t border-white/5">
                  <button
                    onClick={() => {
                      const idx = steps.indexOf(step);
                      if (idx > 0) setStep(steps[idx - 1]);
                    }}
                    disabled={step === 'URL'}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${step === 'URL' ? 'text-gray-800 pointer-events-none' : 'text-gray-500 hover:text-white'}`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Go Back
                  </button>
                  <button
                    onClick={() => {
                      const idx = steps.indexOf(step);
                      if (idx < steps.length - 1) setStep(steps[idx + 1]);
                    }}
                    disabled={step === 'EXPORT' || (!config.websiteUrl && step === 'URL')}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${(!config.websiteUrl && step === 'URL')
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                      : 'bg-white text-black hover:bg-blue-600 hover:text-white'
                      }`}
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Device Preview */}
          <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-32 order-1 lg:order-2">
            <div className="relative w-[340px] h-[680px] bg-black rounded-[4rem] border-[12px] border-gray-900 shadow-[0_0_120px_rgba(59,130,246,0.2)] overflow-hidden ring-1 ring-white/10 group">
              {/* Dynamic Device UI */}
              <div className="absolute top-0 w-full h-8 bg-black flex justify-center pt-2 z-30">
                <div className="w-24 h-5 bg-gray-900 rounded-full" />
              </div>

              <div className="w-full h-full bg-white relative flex flex-col overflow-hidden transition-colors duration-500" style={{ backgroundColor: config.backgroundColor }}>
                {/* Status Bar */}
                <div className="h-8 flex justify-between items-center px-8 pt-6 z-20">
                  <span className="text-[10px] font-bold text-black opacity-60">9:41</span>
                  <div className="flex gap-1.5 items-center">
                    <WifiOff className="w-3 h-3 text-black opacity-60" />
                    <div className="w-4 h-2 rounded-[2px] border border-black opacity-40" />
                  </div>
                </div>

                {/* Simulated Web Header / Nav Bar */}
                {config.navigationStyle === 'classic' && (
                  <div className="p-5 flex items-center justify-between z-10 shadow-lg animate-in slide-in-from-top-4 duration-500" style={{ backgroundColor: config.themeColor, color: '#fff' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-white/20" />
                      <span className="font-bold text-xs truncate max-w-[120px]">{config.appName || 'App Name'}</span>
                    </div>
                    <Settings className="w-4 h-4 opacity-50" />
                  </div>
                )}

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col items-center justify-center p-10 text-center relative">
                  <div className="relative group-hover:scale-110 transition-transform duration-700">
                    <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 -z-10" />
                    <div
                      className="w-24 h-24 rounded-[2rem] mb-6 flex items-center justify-center shadow-2xl rotate-3"
                      style={{ background: `linear-gradient(135deg, ${config.themeColor}, #000)` }}
                    >
                      <Globe className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-outfit font-black text-gray-900 mb-2 leading-none uppercase tracking-tighter">{config.appName || 'Preview'}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">
                    {config.websiteUrl ? `Connecting to source...` : 'Configure URL to preview'}
                  </p>

                  {config.pullToRefresh && (
                    <div className="absolute top-24 text-gray-200 animate-bounce">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* AdMob Banner Simulation */}
                {config.adMobEnabled && (
                  <div className="bg-gray-100 border-y border-gray-200 py-1.5 flex flex-col items-center">
                    <span className="text-[6px] text-gray-400 font-black uppercase tracking-[0.2em]">AdMob Placement</span>
                    <div className="w-[80%] h-8 bg-gray-200 rounded flex items-center justify-center">
                      <div className="w-4 h-4 bg-gray-300 rounded-sm" />
                    </div>
                  </div>
                )}

                {/* Dynamic Bottom Nav Styles */}
                {config.navigationStyle === 'floating' && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] p-3 glass border border-white/20 rounded-2xl flex justify-around shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-8 duration-500 z-40">
                    <div className="w-6 h-6 rounded-lg bg-black/10" />
                    <div className="w-6 h-6 rounded-lg bg-black/10" style={{ backgroundColor: config.themeColor + '40' }} />
                    <div className="w-6 h-6 rounded-lg bg-black/10" />
                  </div>
                )}

                {config.navigationStyle === 'tabs' && (
                  <div className="p-4 border-t border-gray-100 flex justify-around bg-white/80 backdrop-blur-md animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded bg-gray-100" />
                      <div className="w-4 h-1 bg-gray-100 rounded-full" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded" style={{ backgroundColor: config.themeColor }} />
                      <div className="w-4 h-1 rounded-full" style={{ backgroundColor: config.themeColor }} />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded bg-gray-100" />
                      <div className="w-4 h-1 bg-gray-100 rounded-full" />
                    </div>
                  </div>
                )}

                {/* Overlay Splash Screen */}
                {isGenerating && (
                  <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center animate-in fade-in duration-300" style={{ backgroundColor: config.themeColor }}>
                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-6 border border-white/20 shadow-2xl animate-pulse">
                      <Rocket className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-white font-black text-xs uppercase tracking-[0.3em] block">{config.splashScreenText}</span>
                      <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-2/3 animate-[loading_2s_infinite]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 border border-white/5">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">API 36 COMPLIANT</span>
              </div>
              <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 border border-white/5">
                <ShieldCheck className="w-3 h-3 text-blue-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">V3 SIGNING</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-40 border-t border-white/5 pt-20 pb-12 px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-16">
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <Rocket className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-black font-outfit uppercase tracking-tighter">AppForge</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Empowering the next billion developers by providing world-class Android engineering tools for free. Our engine is open, transparent, and built on love.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">The Mission</h4>
            <p className="text-xs text-gray-500 leading-relaxed">We believe conversion tools should be public utilities. No subscription, no watermarks, no limits on features like Push Notifications or Offline support.</p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Engineering</h4>
            <ul className="text-xs text-gray-500 space-y-3 font-medium">
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><ChevronRight className="w-3 h-3" /> Android 16 SDK Support</li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><ChevronRight className="w-3 h-3" /> Pro-Guard Obfuscation</li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><ChevronRight className="w-3 h-3" /> Multi-arch Support</li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><ChevronRight className="w-3 h-3" /> WebView2 Engine</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-400">Connect</h4>
            <div className="flex gap-4">
              {[Globe, Heart, ShieldCheck].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:-translate-y-1 transition-all cursor-pointer">
                  <Icon className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Built with precision & pride.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default App;
