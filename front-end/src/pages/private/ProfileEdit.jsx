import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Camera, 
  Save, 
  Trash2, 
  User, 
  Mail, 
  Globe, 
  MessageSquare 
} from "lucide-react";

export default function EditProfile() {
  const handleSave = (e) => {
    e.preventDefault();
    alert("Changes saved successfully!");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-5%] top-[-5%] h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex h-20 items-center justify-between px-8 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <Link to="/profile" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Profile</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors">
            Discard Changes
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-bold text-black hover:scale-[1.02] transition-all"
          >
            <Save className="h-4 w-4" />
            Save Profile
          </button>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-3xl px-8 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <p className="mt-2 text-zinc-500">Update your personal information and public presence.</p>
        </header>

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Avatar Edit Section */}
          <section className="rounded-[32px] border border-white/10 bg-zinc-950/50 p-8 backdrop-blur-xl">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-zinc-500">Profile Picture</h2>
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative group">
                <div className="h-28 w-28 rounded-full border-2 border-white/10 bg-gradient-to-tr from-blue-500 to-violet-500 p-1">
                  <div className="h-full w-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                    <span className="text-3xl font-bold">JD</span>
                  </div>
                </div>
                <button type="button" className="absolute inset-1 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </button>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex gap-3">
                  <button type="button" className="rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/20 transition-all">
                    Change Photo
                  </button>
                  <button type="button" className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all">
                    <Trash2 className="h-3 w-3" />
                    Remove
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500">JPG, GIF or PNG. Max size of 2MB.</p>
              </div>
            </div>
          </section>

          {/* Basic Info */}
          <section className="rounded-[32px] border border-white/10 bg-zinc-950/50 p-8 backdrop-blur-xl space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="h-3 w-3" /> Full Name
                </label>
                <input 
                  type="text" 
                  defaultValue="John Doe"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="h-3 w-3" /> Email Address
                </label>
                <input 
                  type="email" 
                  defaultValue="john@email.com"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 flex items-center gap-2">
                <MessageSquare className="h-3 w-3" /> Short Bio
              </label>
              <textarea 
                rows="4"
                placeholder="Tell us about yourself..."
                defaultValue="Passionate about clean code and modern architectures."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-all resize-none"
              />
            </div>
          </section>

          {/* Web Presence */}
          <section className="rounded-[32px] border border-white/10 bg-zinc-950/50 p-8 backdrop-blur-xl space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Web Presence</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="portfolio-website.com"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400">
                   {/* Usando o mesmo ícone customizado do GitHub se necessário, ou apenas um ícone genérico */}
                   <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="github.com/your-user"
                    disabled
                    value="github.com/johndoe"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-500 cursor-not-allowed"
                  />
                </div>
                <span className="text-[10px] font-bold text-green-500 uppercase">Linked</span>
              </div>
            </div>
          </section>

        </form>
      </main>
    </div>
  );
}