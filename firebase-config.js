// ============================================
//  SUN SEEKERS TRAVELS — FIREBASE CONFIG
//  Replace the values below with your own
//  Firebase project credentials from:
//  https://console.firebase.google.com
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyDphBvzLN4-q-s0r6rqwehV9PJg7TSZDGA",
  authDomain: "saffron-hut.firebaseapp.com",
  projectId: "saffron-hut",
  storageBucket: "saffron-hut.firebasestorage.app",
  messagingSenderId: "83428980932",
  appId: "1:83428980932:web:267448edd2d369a6fc3191"
};

// Initialize Firebase (using compat SDK loaded via CDN)
firebase.initializeApp(firebaseConfig);

const db   = firebase.firestore();
const auth = firebase.auth();

// ── Firestore collection references ──────────
const Col = {
  hotels:       () => db.collection('hotels'),
  fleet:        () => db.collection('fleet'),
  packages:     () => db.collection('packages'),
  testimonials: () => db.collection('testimonials'),
  bookings:     () => db.collection('bookings'),
  settings:     () => db.collection('settings'),
};

// ── Helpers ───────────────────────────────────
async function fsGet(collection) {
  const snap = await Col[collection]().orderBy('order', 'asc').get().catch(() =>
    Col[collection]().get()
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function fsAdd(collection, data) {
  data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  return Col[collection]().add(data);
}

async function fsUpdate(collection, id, data) {
  data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
  return Col[collection]().doc(id).update(data);
}

async function fsDelete(collection, id) {
  return Col[collection]().doc(id).delete();
}

// ── Seed default data if collections are empty ─
async function seedIfEmpty() {
  const hotels = await Col.hotels().limit(1).get();
  if (!hotels.empty) return;

  const defaultHotels = [
    { name: 'The LaLiT Grand Palace Srinagar', stars: 5, category: '5star', location: 'Srinagar', price: '₹12,000', description: 'A magnificent 19th-century palace turned luxury hotel overlooking Dal Lake. Stunning views, royal suites, and world-class dining.', amenities: ['Dal Lake View', 'Spa & Wellness', 'Fine Dining', 'Outdoor Pool', 'Conference Hall'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700&q=85', badge: 'Luxury', order: 1, active: true },
    { name: 'Vivanta Dal View', stars: 5, category: '5star', location: 'Srinagar', price: '₹9,500', description: 'Taj Hotels flagship Kashmir property offering panoramic Himalayan views, traditional Kashmiri cuisine, and premium amenities.', amenities: ['Panoramic Views', 'Kashmiri Cuisine', 'Heated Pool', 'Gym', 'Valet Parking'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=700&q=85', badge: 'Premium', order: 2, active: true },
    { name: 'Hotel Boulevard Srinagar', stars: 4, category: '4star', location: 'Dal Lake', price: '₹5,500', description: 'Perfectly positioned on the Dal Lake boulevard, this elegant hotel offers beautiful lake-facing rooms and exceptional hospitality.', amenities: ['Lake View Rooms', 'Restaurant', 'Conference Room', 'Travel Desk', 'Wi-Fi'], image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=700&q=85', badge: 'Popular', order: 3, active: true },
    { name: 'Heevan Resort Pahalgam', stars: 4, category: '4star', location: 'Pahalgam', price: '₹4,800', description: 'Set amidst pine forests and the Lidder river, Heevan Resort offers a serene escape with modern comforts and mountain charm.', amenities: ['River View', 'Garden', 'Multi-cuisine Restaurant', 'Bonfire Area', 'Room Service'], image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=700&q=85', badge: 'Nature Stay', order: 4, active: true },
    { name: 'Pine N Peak Gulmarg', stars: 3, category: '3star', location: 'Gulmarg', price: '₹2,800', description: 'A cozy mountain hotel surrounded by pine trees with easy access to Gulmarg gondola and ski slopes. Perfect for adventure seekers.', amenities: ['Mountain View', 'Hot Water', 'Bonfire Lounge', 'Parking', 'Travel Desk'], image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=85', badge: 'Budget Friendly', order: 5, active: true },
    { name: 'Zahoor Houseboat', stars: 3, category: '3star', location: 'Dal Lake', price: '₹2,200', description: 'An authentic Kashmiri wooden houseboat experience on the tranquil Dal Lake — waking up to mirror-calm waters and floating gardens.', amenities: ['Shikara Ride', 'Kashmiri Wazwan', 'Rooftop Deck', 'Lake Access', 'Unique Experience'], image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=85', badge: 'Houseboat', order: 6, active: true },
  ];

  const batch = db.batch();
  defaultHotels.forEach(h => {
    const ref = Col.hotels().doc();
    batch.set(ref, { ...h, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  });
  await batch.commit();
  console.log('✅ Default hotels seeded to Firestore');
}
