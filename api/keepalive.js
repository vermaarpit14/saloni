// Called once a day by Vercel Cron (see vercel.json). A tiny read keeps a free Supabase project from being paused for inactivity.
import {rest} from './_db.js'
export default async function handler(req,res){const r=await rest('site_settings?id=eq.1&select=id');res.statusCode=r?200:500;res.end(r?'ok':'failed')}
