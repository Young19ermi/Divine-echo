import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
//TakeAway
// '!' is non null assertion which means this declaration won't be undefined.
// To call the env variables just type like this process.env.'the name convention of enviromental variable '
// .env --> it always should start with 'EXPO_PUBLIC_SUPABASE_'What ever''
