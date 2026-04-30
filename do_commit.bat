@echo off
cd /d F:\Amber_solutions_Kira\bm_site
git add -A
git commit -m "fix: carousel - brightness instead of opacity for dark cards, mix-blend-mode screen for eye-cream, bottle position top raised"
git push origin main
echo Done!
pause
