import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { User, Mail, Phone, Shield, Calendar } from 'lucide-react';
import api from '../services/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/users/profile')
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!profile) return <div className="min-h-screen bg-page text-txt-main">Loading...</div>;

  return (
    <div className="min-h-screen bg-page text-txt-main transition-colors duration-300">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-12">
        
        <div className="bg-card border border-txt-muted/20 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                
                {/* Avatar Section */}
                <div className="flex flex-col items-center">
                    <div className="w-32 h-32 bg-input rounded-full flex items-center justify-center text-txt-muted border-4 border-page shadow-lg">
                        <User size={64} />
                    </div>
                    <span className="mt-4 px-3 py-1 bg-brand-blue/10 text-brand-blue text-xs font-bold rounded-full uppercase tracking-wide">
                        {profile.role}
                    </span>
                </div>

                {/* Details Section */}
                <div className="flex-1 w-full text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                    <p className="text-txt-dim mb-6">@{profile.username}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-input rounded-xl flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-white/10 rounded-lg text-brand-purple">
                                <Mail size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-txt-dim uppercase">Email</p>
                                <p className="font-medium text-sm truncate">{profile.email}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-input rounded-xl flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-white/10 rounded-lg text-emerald-500">
                                <Phone size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-txt-dim uppercase">Phone</p>
                                <p className="font-medium text-sm">{profile.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
}