# 0001. Arsitektur MVP Katalog Menu dan Reservasi Ruangan

Tahap awal sistem dirancang sebagai kanal informasi dan reservasi terpisah tanpa integrasi POS, pembayaran, atau database live. 

Semua pengajuan sewa menghasilkan kode booking dengan status awal "Menunggu Konfirmasi" yang diteruskan ke WhatsApp Admin melalui pre-filled message, sementara data menu dan ruangan dikelola melalui mock data terisolasi (`data/`) dengan schema TypeScript yang siap dialihkan ke Headless CMS atau database tanpa merombak komponen UI.
