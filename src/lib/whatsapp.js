const PHONE = '01029913210'
const WHATSAPP_NUMBER = '201029913210'

export function telLink() {
  return `tel:+${PHONE}`
}

export function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function menuWhatsApp() {
  return whatsappLink(`يا شباب GPS Cafe ☕

عايز استفسر عن المنيو 👀
ممكن تبعتلي التفاصيل؟
تسلموا 🙌`)
}

export function padelWhatsApp({ name, hours, day, hour }) {
  const h = hours || 1
  const n = name || '—'
  const d = day || '—'
  const hh = hour || '—'
  return whatsappLink(`🎾 حجز ملعب بادل | GPS Club
━━━━━━━━━━━━━━━━━━

الاسم: ${n}
اليوم: ${d}
الساعة: ${hh}
المدة: ${h} ساعة

ياريت تأكدولي التوفّر والإجار
وإمتى أقدر أجي 🙏`)
}

export function playstationWhatsApp({ name, type, day, hour }) {
  const n = name || '—'
  const t = type || 'سطح بلايستيشن'
  const d = day || '—'
  const hh = hour || '—'
  return whatsappLink(`🎮 حجز جيمنج | GPS Club
━━━━━━━━━━━━━━━━━━

الاسم: ${n}
نوع الحجز: ${t}
اليوم: ${d}
الساعة: ${hh}

متاحين أيوة؟ عايز أجي 🙌`)
}

export function eventsWhatsApp({ name, eventType, pax, date, details }) {
  return whatsappLink(`🎉 حجز EVENT | GPS Club
━━━━━━━━━━━━━━━━━━

👤 الاسم: ${name || '—'}
🎯 المناسبة: ${eventType || '—'}
👥 العدد: ${pax || '—'}
📅 التاريخ: ${date || '—'}
📝 تفاصيل: ${details || '—'}

ياريت تبلغوني بالتكلفة
والتفاصيل الكاملة عشان أظبط الدنيا
مرسي 🤝`)
}