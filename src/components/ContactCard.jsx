import { useTranslation } from 'react-i18next'
import { telLink, whatsappLink } from '../lib/whatsapp.js'

export default function ContactCard({ wtsMessage = 'السلام عليكم' }) {
  const { t } = useTranslation()
  return (
    <div className="glass rounded-2xl p-4 space-y-3 text-center shadow-lg">
      <p className="text-white/70 text-sm font-medium">{t('quickContact')}</p>
      <div className="flex gap-3 justify-center">
        <a
          href={telLink()}
          className="flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-full text-gold hover:bg-gold/30 transition-all text-sm font-bold active:scale-95"
        >
          <span className="text-lg">{String.fromCharCode(0x260E)}</span> {t('call')}
        </a>
        <a
          href={whatsappLink(wtsMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-green-600/20 rounded-full text-green-400 hover:bg-green-600/35 transition-all text-sm font-bold active:scale-95"
        >
          <span className="text-lg">{String.fromCharCode(0x26A8)}</span>
          {t('whatsapp')}
        </a>
      </div>
    </div>
  )
}