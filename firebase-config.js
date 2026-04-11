// ════════════════════════════════════════════════════
//  SUN SEEKERS TRAVELS — FIREBASE CONFIG
//  ▶ YAHAN APNI FIREBASE PROJECT KI VALUES DAALO
//  console.firebase.google.com → Project Settings → Web App
// ════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey: "AIzaSyDphBvzLN4-q-s0r6rqwehV9PJg7TSZDGA",
  authDomain: "saffron-hut.firebaseapp.com",
  projectId: "saffron-hut",
  storageBucket: "saffron-hut.firebasestorage.app",
  messagingSenderId: "83428980932",
  appId: "1:83428980932:web:267448edd2d369a6fc3191"
};

firebase.initializeApp(firebaseConfig);
const db   = firebase.firestore();
const auth = firebase.auth();

const FS = {
  hotels:       db.collection('hotels'),
  fleet:        db.collection('fleet'),
  packages:     db.collection('packages'),
  testimonials: db.collection('testimonials'),
  bookings:     db.collection('bookings'),
  gallery:      db.collection('gallery'),
  settings:     db.collection('settings'),
};

const getAll = async (col, activeOnly = true) => {
  try {
    let q = activeOnly ? FS[col].where('active','==',true) : FS[col];
    try { q = q.orderBy('order','asc'); } catch(e){}
    const snap = await q.get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) {
    try {
      const snap = await FS[col].get();
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return activeOnly ? all.filter(x => x.active !== false) : all;
    } catch(e2) { return []; }
  }
};

const saveDoc = async (col, id, data) => {
  data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
  if (id) return FS[col].doc(id).update(data);
  data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  return FS[col].add(data);
};

const deleteDoc = (col, id) => FS[col].doc(id).delete();

async function seedAllDefaultData() {
  const hSnap = await FS.hotels.limit(1).get();
  if (hSnap.empty) {
    const hotels = [
      { name:'The LaLiT Grand Palace', stars:5, category:'5star', location:'Srinagar', price:'₹12,000', description:'A magnificent 19th-century palace turned luxury hotel overlooking Dal Lake. Royal suites, spa & world-class dining.', amenities:['Dal Lake View','Spa & Wellness','Fine Dining','Outdoor Pool'], image:'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700&q=85', badge:'Luxury', order:1, active:true },
      { name:'Vivanta Dal View', stars:5, category:'5star', location:'Srinagar', price:'₹9,500', description:'Taj Hotels Kashmir flagship with panoramic Himalayan views, Kashmiri cuisine and heated pool.', amenities:['Mountain View','Kashmiri Cuisine','Heated Pool','Gym'], image:'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=700&q=85', badge:'Premium', order:2, active:true },
      { name:'Hotel Boulevard Srinagar', stars:4, category:'4star', location:'Dal Lake', price:'₹5,500', description:'Perfectly positioned on Dal Lake boulevard with beautiful lake-facing rooms.', amenities:['Lake View Rooms','Restaurant','Conference Room','Wi-Fi'], image:'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=700&q=85', badge:'Popular', order:3, active:true },
      { name:'Heevan Resort Pahalgam', stars:4, category:'4star', location:'Pahalgam', price:'₹4,800', description:'Amidst pine forests and the Lidder river. Serene escape with mountain charm.', amenities:['River View','Garden','Bonfire Area','Multi-Cuisine'], image:'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=700&q=85', badge:'Nature Stay', order:4, active:true },
      { name:'Pine N Peak Gulmarg', stars:3, category:'3star', location:'Gulmarg', price:'₹2,800', description:'Cozy mountain hotel near gondola and ski slopes. Perfect for adventure seekers.', amenities:['Mountain View','Hot Water','Bonfire Lounge','Parking'], image:'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=85', badge:'Budget Friendly', order:5, active:true },
      { name:'Zahoor Houseboat', stars:3, category:'3star', location:'Dal Lake', price:'₹2,200', description:'Authentic Kashmiri wooden houseboat on tranquil Dal Lake with shikara access.', amenities:['Shikara Ride','Wazwan Dining','Rooftop Deck','Lake Access'], image:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=85', badge:'Houseboat', order:6, active:true },
    ];
    const b = db.batch();
    hotels.forEach(h => b.set(FS.hotels.doc(), { ...h, createdAt: firebase.firestore.FieldValue.serverTimestamp() }));
    await b.commit();
  }

  const fSnap = await FS.fleet.limit(1).get();
  if (fSnap.empty) {
    const fleet = [
      { name:'Maruti Swift Dzire', category:'Sedan', seats:'4', badge:'Sedan', features:['Full AC','Music System','GPS'], description:'Classic choice for couples and solo travellers. Great mileage, smooth ride.', image:'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&q=80', order:1, active:true },
      { name:'Honda Amaze', category:'Sedan', seats:'4', badge:'Sedan', features:['Full AC','Spacious Boot','Quiet Cabin'], description:'Roomier sedan with Honda build quality. Excellent for outstation trips.', image:'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80', order:2, active:true },
      { name:'Toyota Innova', category:'SUV', seats:'7', badge:'SUV', features:['Dual AC','Mountain Ready','GPS'], description:'The workhorse of Kashmir tourism. Reliable and powerful for any road.', image:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80', order:3, active:true },
      { name:'Toyota Innova Crysta', category:'SUV', seats:'7', badge:'Luxury SUV', features:['Leather Seats','Premium Sound','Dual AC'], description:'Premium SUV — perfect for honeymooners and VIP travellers.', image:'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&q=80', order:4, active:true },
      { name:'Force Urbania', category:'Van', seats:'12-17', badge:'Premium Van', features:['Recliner Seats','Full AC','Large Luggage'], description:"India's premium minibus with reclining seats and mountain-ready engine.", image:'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&q=80', order:5, active:true },
      { name:'Tavera', category:'SUV', seats:'8', badge:'SUV', features:['Full AC','Ample Luggage','Reliable'], description:'Robust and reliable with generous seating for extended family trips.', image:'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80', order:6, active:true },
      { name:'Tempo Traveller', category:'Van', seats:'12-26', badge:'Minibus', features:['Full AC','Entertainment','High Capacity'], description:'Go-to vehicle for large tourist groups, pilgrimages and school trips.', image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', order:7, active:true },
      { name:'Standard Bus', category:'Bus', seats:'35-45', badge:'Bus', features:['Large Storage','Experienced Driver','Budget Friendly'], description:'Reliable and cost-effective transport for large groups across J&K.', image:'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80', order:8, active:true },
      { name:'Luxury Coach', category:'Bus', seats:'35-45', badge:'Luxury Bus', features:['Full AC','Entertainment System','Recliner Seats'], description:'Premium coaches for corporate events, wedding convoys and VIP tours.', image:'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80', order:9, active:true },
    ];
    const b = db.batch();
    fleet.forEach(v => b.set(FS.fleet.doc(), { ...v, createdAt: firebase.firestore.FieldValue.serverTimestamp() }));
    await b.commit();
  }

  const pSnap = await FS.packages.limit(1).get();
  if (pSnap.empty) {
    const packages = [
      { name:'Srinagar Weekend Escape', duration:'2 Days / 1 Night', price:'₹4,500', category:'short', tagline:'Dal Lake, Gardens & Old City', badge:'2 Days', highlights:['Shikara ride on Dal Lake at sunrise','Mughal Gardens — Nishat & Shalimar','Shankaracharya Temple & Pari Mahal','Old Srinagar bazaars & Jama Masjid'], image:'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=700&q=85', order:1, active:true },
      { name:'Classic Kashmir — 3 Days', duration:'3 Days / 2 Nights', price:'₹8,999', category:'short', tagline:'Srinagar · Gulmarg · Pahalgam', badge:'Best Seller', highlights:['Day 1: Srinagar sightseeing + Dal Lake shikara','Day 2: Gulmarg gondola & snow activities','Day 3: Pahalgam — Betaab Valley & Baisaran'], image:'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=700&q=85', order:2, active:true },
      { name:'Romantic Kashmir Honeymoon', duration:'4 Days / 3 Nights', price:'₹14,999', category:'honeymoon', tagline:'A love story set in paradise', badge:'Honeymoon', highlights:['Day 1: Arrival + houseboat stay on Dal Lake','Day 2: Gulmarg gondola to Apharwat Peak','Day 3: Pahalgam — Lidder riverbank picnic','Day 4: Sonmarg + Thajiwas Glacier'], image:'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&q=85', order:3, active:true },
      { name:'Complete Kashmir — 5 Days', duration:'5 Days / 4 Nights', price:'₹12,500', category:'medium', tagline:'Everything Kashmir in one journey', badge:'Most Complete', highlights:['Day 1: Srinagar city tour + Dal Lake','Day 2: Gulmarg ski slopes & gondola','Day 3: Pahalgam & Betaab Valley','Day 4: Sonmarg & Thajiwas Glacier','Day 5: Doodhpathri & departure'], image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=85', order:4, active:true },
      { name:'Family Kashmir Adventure', duration:'5 Days / 4 Nights', price:'₹9,999', category:'medium', tagline:'Memories for every generation', badge:'Family', highlights:['Shikara boat rides & houseboat experience','Pony rides in Pahalgam for kids','Snow play in Gulmarg','Force Urbania with ample luggage space'], image:'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=700&q=85', order:5, active:true },
      { name:'Winter Wonderland Kashmir', duration:'4 Days / 3 Nights', price:'₹13,999', category:'winter', tagline:'Where snow dreams come true', badge:'Winter Special', highlights:['Frozen Dal Lake shikara & ice walks','Gulmarg skiing & snowboarding','Pahalgam snow trek to Baisaran','4WD mountain-ready vehicles for icy roads'], image:'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=700&q=85', order:6, active:true },
      { name:'Grand Kashmir — 7 Days', duration:'7 Days / 6 Nights', price:'₹18,999', category:'long', tagline:'The ultimate valley experience', badge:'Premium', highlights:['Days 1-2: Srinagar — Dal, Gardens, Old City','Day 3: Gulmarg full day ski & gondola','Day 4: Pahalgam & Aru Valley','Day 5: Sonmarg & Zoji La viewpoint','Day 6: Doodhpathri & Yusmarg meadows'], image:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=85', order:7, active:true },
    ];
    const b = db.batch();
    packages.forEach(p => b.set(FS.packages.doc(), { ...p, createdAt: firebase.firestore.FieldValue.serverTimestamp() }));
    await b.commit();
  }

  const tSnap = await FS.testimonials.limit(1).get();
  if (tSnap.empty) {
    const testimonials = [
      { name:'Rahul Kumar', location:'Delhi, India 🇮🇳', stars:5, initials:'RK', review:'An absolutely seamless experience. From Dal Lake to Gulmarg, our driver knew every scenic spot. The Innova Crysta was spotless and the ride was smooth even on mountain roads.', order:1, active:true },
      { name:'Priya Sharma', location:'Mumbai, India 🇮🇳', stars:5, initials:'PS', review:'We booked a Tempo Traveller for our family of 18 people. Sun Seekers was incredibly professional — on time, well-maintained vehicle, and the driver was knowledgeable and kind.', order:2, active:true },
      { name:'Ahmad Hassan', location:'Dubai, UAE 🇦🇪', stars:5, initials:'AH', review:'Used their airport transfer and sightseeing package. The WhatsApp communication was instant, pricing was transparent, and I felt completely safe throughout my Kashmir trip.', order:3, active:true },
      { name:'Neha & Mohit', location:'Pune, India 🇮🇳', stars:5, initials:'NM', review:'Our honeymoon trip was perfect. The team decorated the car beautifully. We felt like royalty! Highly recommend Sun Seekers Travels.', order:4, active:true },
      { name:'Vikram Bhat', location:'Bangalore, India 🇮🇳', stars:5, initials:'VB', review:'Corporate event transfers went flawlessly. 40 delegates, no delays. Kamran Sharif personally coordinated everything. Will continue using them.', order:5, active:true },
      { name:'Zara Khan', location:'Lahore, Pakistan 🇵🇰', stars:5, initials:'ZK', review:"Travelled Srinagar to Pahalgam in heavy snow. The driver was skilled and calm. Sun Seekers truly understands Kashmir's terrain. Best travel company!", order:6, active:true },
    ];
    const b = db.batch();
    testimonials.forEach(t => b.set(FS.testimonials.doc(), { ...t, createdAt: firebase.firestore.FieldValue.serverTimestamp() }));
    await b.commit();
  }

  const gSnap = await FS.gallery.limit(1).get();
  if (gSnap.empty) {
    const gallery = [
      { label:'Kashmir Mountain Peaks', category:'landscapes', image:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85', tall:true, order:1, active:true },
      { label:'Dal Lake, Srinagar', category:'destinations', image:'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=700&q=85', order:2, active:true },
      { label:'Gulmarg in Winter', category:'destinations', image:'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=700&q=85', order:3, active:true },
      { label:'Kashmir Valley Panorama', category:'landscapes', image:'https://images.unsplash.com/photo-1585506942812-e72b29cef752?w=1000&q=85', wide:true, order:4, active:true },
      { label:'Winter Wonderland', category:'seasons', image:'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=700&q=85', order:5, active:true },
      { label:'Sonmarg — Meadow of Gold', category:'destinations', image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=85', order:6, active:true },
      { label:'Mountain Roads', category:'landscapes', image:'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=800&q=85', tall:true, order:7, active:true },
      { label:'Road Journeys', category:'travel', image:'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=700&q=85', order:8, active:true },
      { label:'Autumn Chinars', category:'seasons', image:'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=700&q=85', order:9, active:true },
      { label:'Pahalgam Valley', category:'destinations', image:'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1000&q=85', wide:true, order:10, active:true },
      { label:'Snow Peaks', category:'landscapes', image:'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=700&q=85', order:11, active:true },
      { label:'Tulip Season', category:'seasons', image:'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=700&q=85', order:12, active:true },
    ];
    const b = db.batch();
    gallery.forEach(g => b.set(FS.gallery.doc(), { ...g, createdAt: firebase.firestore.FieldValue.serverTimestamp() }));
    await b.commit();
  }

  console.log('✅ All Firestore data seeded!');
}
