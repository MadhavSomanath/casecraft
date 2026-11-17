import type { Case, CatId, Level } from "./types";

const BASE: Record<CatId, Level> = { design: "Medium", improve: "Medium", rca: "Medium", guess: "Easy", metrics: "Medium", gtm: "Hard", pricing: "Hard", ai: "Hard", behav: "Easy" };
// Judgment calls on top of the per-type default.
const HARD = new Set(["voter", "long-transport", "tier2", "airport", "ai-writer", "agent-tcr", "subs", "dau", "chatbot", "gpus", "darkstores", "zoom", "elevators", "tennis"]);
const EASY = new Set(["cook", "fitness", "book-rec", "bicycle", "youtube", "spotify", "whatsapp", "atms", "iphones", "upi", "tmay", "measure-ai"]);

const C = (id: string, cat: CatId, title: string, prompt: string, hidden?: string): Case =>
  ({ id, cat, title, prompt, hidden, level: HARD.has(id) ? "Hard" : EASY.has(id) ? "Easy" : BASE[cat] });

export const CASES: Case[] = [
  // Product design
  C("cook", "design", "An app that helps people cook", "Design an app that helps individuals cook at home."),
  C("kids-social", "design", "Social media for children", "Design a social media platform for children."),
  C("atm-blind", "design", "An ATM for the blind", "Design an ATM for visually impaired users."),
  C("turf", "design", "Turf booking app", "Design an app for booking sports turfs in Indian cities."),
  C("devs", "design", "A product for software developers", "Design a product for software developers."),
  C("homestay", "design", "A product for homestay owners", "Design a product for homestay owners."),
  C("gig-fin", "design", "Financial product for gig workers", "Design a financial product for gig workers (delivery partners, drivers) in India."),
  C("lastmile", "design", "Last-mile delivery product", "Design a product that improves last-mile delivery."),
  C("long-transport", "design", "Long-distance mode of transport", "Design a new mode of transport for long-distance travel."),
  C("office-share", "design", "Office space sharing", "Design a product for sharing office space."),
  C("voter", "design", "Increase voter turnout", "Design a product to increase voter turnout in Indian elections."),
  C("disney", "design", "Disney theme park experience", "Design a product that improves the experience of visiting a Disney theme park."),
  C("ola-kids", "design", "Ola for schoolkids", "Ola wants to launch a ride service for schoolchildren. Design it."),
  C("airline-ent", "design", "Airline entertainment system", "Design an in-flight entertainment system for an airline."),
  C("podcast", "design", "Podcast experience at Spotify", "You're a PM at Spotify. Design a better podcast experience."),
  C("fitness", "design", "Health and fitness app", "Design a health and fitness app."),
  C("book-rec", "design", "Book recommendation app", "Design a book recommendation app."),
  C("buds", "design", "Samsung Galaxy Buds experience", "Improve the end-to-end experience of Samsung Galaxy Buds."),
  C("antique", "design", "Antique marketplace", "Design an online marketplace for antiques."),
  C("bicycle", "design", "Bicycle renting app", "Design a bicycle renting app for an Indian city."),
  // Improvement
  C("paytm", "improve", "Improve Paytm", "How would you improve Paytm?"),
  C("youtube", "improve", "Improve YouTube", "How would you improve YouTube?"),
  C("airport", "improve", "Airport operational efficiency", "Improve the operational efficiency of a major Indian airport."),
  C("whatsapp", "improve", "Improve WhatsApp", "How would you improve WhatsApp?"),
  C("spotify", "improve", "Improve Spotify", "How would you improve Spotify?"),
  C("dating", "improve", "Improve a dating app", "Pick a dating app you know and improve it."),
  C("tier2", "improve", "Teaching in tier-2 cities", "Improve the quality of teaching in tier-2 cities using a product."),
  C("bms", "improve", "BookMyShow user engagement", "BookMyShow users open the app only when they want to book a ticket. Increase engagement."),
  C("fb-reactions", "improve", "Facebook Reactions", "Evaluate and improve Facebook Reactions."),
  // RCA
  C("fulfil", "rca", "Order fulfilment dropped", "Our e-commerce order fulfilment rate dropped by 12% this week. Find the root cause.", "A new warehouse management system was rolled out last Monday in the two western-region warehouses (Mumbai, Pune). Its inventory sync lags by ~6 hours, so the app accepts orders for items already out of stock, which are later cancelled. Only western-region orders are affected; all platforms; no competitor or seasonal change."),
  C("wau", "rca", "Weekly active users dropped", "Weekly active users of our music streaming app fell 15% over the last two weeks. Why?", "An Android release (v8.2) two weeks ago broke push notification deep links: tapping a notification opens a blank screen. Android is 80% of users. iOS WAU is flat. Notifications drove ~30% of weekly sessions. App store reviews mention 'notification opens nothing'."),
  C("upi-txn", "rca", "Drop in transacting users", "A UPI payments app saw a 10% drop in monthly transacting users. Diagnose it.", "A competitor launched a cashback campaign (₹50 on first 3 merchant payments) three weeks ago, targeted at tier-2 cities. The drop is concentrated in tier-2 merchant payments among users aged 18-25. P2P transfers are flat. No product changes on our side."),
  C("atc", "rca", "Decline in add-to-cart", "Add-to-cart actions on our fashion e-commerce app declined 18% in 10 days. What happened?", "A product detail page redesign shipped 10 days ago. On small-screen Android phones (under 6 inch, ~35% of traffic) the Add to Cart button now sits below the fold behind the size chart. Large screens and iOS are fine. PDP views are flat."),
  C("ecom-sales", "rca", "Drop in sales on an e-commerce app", "Sales on our e-commerce app dropped 20% this month. Find the cause.", "Checkout payment success fell after the payment gateway was switched to a cheaper provider; card payments from two large banks fail ~40% of the time with an OTP timeout. Traffic, add-to-cart and checkout starts are flat. COD orders are unaffected."),
  C("zomato-aov", "rca", "Zomato average order value dropped", "Zomato's average order value dropped 8% month on month. Investigate.", "Zomato cut delivery fees on small orders and launched a 'mini meals' category under ₹150 a month ago. Order count rose 12%, so total GMV is up ~3%. The AOV drop is a mix shift, mostly students and young professionals at lunch. It's not a real problem but a trade-off to evaluate."),
  C("ai-writer", "rca", "AI writing assistant usage dropped", "Daily usage of our AI writing assistant dropped 25% after last month. Why?", "A model upgrade three weeks ago improved quality scores but raised median response time from 2s to 7s and made outputs ~2x longer. Abandonment before the response finishes doubled. Heavy users on mobile churned most. No pricing change."),
  C("agent-tcr", "rca", "AI agent task completion rate dropped", "Our travel booking AI agent's task completion rate fell from 78% to 61%. Diagnose.", "A partner airline aggregator changed its API auth and response schema 9 days ago. Flight-booking tool calls now fail silently and the agent retries, then gives up. Hotel and cab tasks are unaffected. Evals didn't catch it because the eval suite mocks the API."),
  C("flat-launch", "rca", "The launch that changed nothing", "We launched a 'save for later' feature four weeks ago. Conversion is flat. What went wrong?", "The feature is reachable only from a menu inside the cart, so only 3% of users have seen it. Users who used it convert 9% better over 2 weeks. The launch had no announcement or onboarding. The success metric (overall conversion) was too broad to show a 3%-reach feature."),
  C("ride-cancel", "rca", "Spike in ride cancellations", "Ride cancellations on our ride-hailing app spiked 22% this week. Why?", "A new driver incentive pays a bonus per completed trip only inside a hot zone. Drivers now cancel long-pickup rides to stay in zone. Spike is in Bangalore and Hyderabad at evening peak, driver-initiated cancellations, not rider-initiated."),
  C("subs", "rca", "Decline in subscriptions", "New subscriptions on our OTT platform declined 30% this quarter. Diagnose.", "Two things: a 25% price increase in India in month 1, and a competitor won streaming rights for the cricket season that started in month 2. Drop is concentrated among sports-first users in India; international is flat. Trial-to-paid conversion also fell after the price change."),
  C("dau", "rca", "Drop in daily active users", "DAU of our news app dropped 12% last week. What happened?", "Nothing is broken. A data pipeline change last week started de-duplicating users across web and app, so the same user is no longer counted twice. Actual sessions and time spent are flat. The drop is a measurement change."),
  C("low-adoption", "rca", "Low adoption of a new feature", "We launched a budgeting feature in our banking app and only 2% of users tried it. Why?", "It requires users to categorize 30 past transactions manually before showing anything. 70% of users who start onboarding drop at that step. Users who finish it rate it highly."),
  C("chatbot", "rca", "Users abandoning our AI chatbot", "40% of users now abandon our customer-support AI chatbot mid-conversation. Why?", "The returns policy changed a month ago but the RAG knowledge index wasn't refreshed, so the bot confidently gives the old 30-day policy, users get contradicted, and there's no handoff to a human for 'returns' intents. Order-status queries work fine."),
  C("crm", "rca", "Low CRM adoption", "Our sales team isn't using the new CRM we rolled out. Find out why.", "Field reps must enter the same data twice (CRM and the old Excel tracker managers still ask for). There's no mobile app, and reps are on the road 70% of the time. Inside-sales adoption is fine."),
  // Guesstimates
  C("insta", "guess", "Daily Instagram posts in India", "Estimate the number of Instagram posts uploaded in India per day.", "Reference answer: ~38M posts/day (personal accounts, posts only), via ~1.4B × 70% smartphone × 50% on Instagram × 80% active, split into light/moderate/heavy posters."),
  C("yt-rev", "guess", "YouTube's daily ad revenue in the US", "Estimate YouTube's daily ad revenue in the United States.", "Reference answer: ~$20M/day (~2B daily US views × 50% monetized × $20 CPM), sanity-checked against Google's ~$200B ad revenue."),
  C("tennis", "guess", "Tennis balls in a Boeing 747", "How many tennis balls fit in a Boeing 747?", "Reference: a 747 cabin is ~70m × 6m × 2.5m ≈ 1,000 m³ usable volume; a tennis ball ≈ 0.00015 m³; with ~65% packing efficiency ≈ 4-5 million balls (more if cargo hold included)."),
  C("iphones", "guess", "iPhones sold in India per year", "Estimate the number of iPhones sold in India in a year.", "Reference: roughly 10-12 million units per year (about 7-8% of ~150M smartphones sold annually)."),
  C("atms", "guess", "ATMs in India", "Estimate the number of ATMs in India.", "Reference: about 2.5 lakh (250,000) ATMs."),
  C("delhi-flights", "guess", "Flights departing Delhi airport daily", "Estimate the number of flights that take off from Delhi airport every day.", "Reference: about 650-700 departures per day (~1,300-1,400 total movements)."),
  C("gpus", "guess", "GPUs needed to serve ChatGPT", "Estimate the number of GPUs required to serve ChatGPT's daily traffic.", "Reference approach: daily queries (~1-2B) × tokens per query (~1,000) ÷ tokens per second per GPU (~1,000-2,000 with batching) ÷ 86,400 s, × peak factor (2-3x) and utilization → order of tens of thousands to ~100k+ GPUs."),
  C("upi", "guess", "UPI transactions per day", "Estimate the number of UPI transactions in India per day.", "Reference: ~600-700 million per day in 2025-26 (~18-20B per month)."),
  C("google-ads", "guess", "Google Ads revenue", "Estimate the annual revenue Google earns from ads.", "Reference: ~$250-270B per year in total ad revenue (search ~$190B, YouTube ~$35B, network ~$30B)."),
  C("elevators", "guess", "Elevators in a commercial building", "How many elevators does a 30-floor commercial office building need?", "Reference approach: ~150 people/floor × 30 = 4,500; peak 5-min arrival ~12-15%; elevator capacity ~15 people, round trip ~2.5 min → about 10-14 elevators."),
  C("food-users", "guess", "Food delivery app users", "Estimate the number of monthly transacting users of food delivery apps in India.", "Reference: ~60-80 million monthly transacting users across Zomato and Swiggy."),
  C("darkstores", "guess", "Dark stores for 10-minute delivery in Ahmedabad", "How many dark stores are needed to cover Ahmedabad for 10-minute delivery?", "Reference approach: serviceable urban area ~500 km²; 10-min delivery radius ~2-2.5 km → ~15-20 km² per store → 30-40 stores for coverage, then check demand capacity (~1,500-2,500 orders/store/day)."),
  C("zoom", "guess", "Zoom's daily server usage", "Estimate Zoom's daily server usage for India.", "Reference approach: working population × white-collar share × VC adoption (~60%) × meeting hours × bandwidth per stream (~1-2 Mbps video), then convert to data volume per day."),
  // Metrics
  C("insta-creator", "metrics", "Instagram creator marketplace", "Define success metrics for Instagram's creator marketplace (brands find and pay creators)."),
  C("fb-market", "metrics", "Facebook Marketplace", "What metrics would you track for Facebook Marketplace? Pick a North Star."),
  C("bigbasket", "metrics", "BigBasket", "You're the PM for BigBasket. Define its metrics and North Star."),
  C("gpay-promo", "metrics", "Promotion in Google Pay", "Google Pay is running a scratch-card promotion. How do you measure if it worked?"),
  C("wa-video", "metrics", "WhatsApp in-app video playing", "WhatsApp launched in-app playback for video links. How do you measure success?"),
  // GTM / category launch
  C("amz-pharmacy", "gtm", "Amazon Pharmacy launch", "Plan the launch of Amazon Pharmacy in India."),
  C("alcohol", "gtm", "Alcohol category in e-commerce", "Should an e-commerce platform launch an alcohol category in India? How?"),
  C("fk-grocery", "gtm", "Grocery category for Flipkart", "Plan Flipkart's grocery category launch."),
  C("furniture-qc", "gtm", "Furniture on quick commerce", "Should a quick-commerce platform launch furniture? Plan it."),
  C("uc-maid", "gtm", "Instant maid for Urban Company", "Plan Urban Company's launch of an instant maid service."),
  C("social-fit", "gtm", "Social fitness product", "Go-to-market strategy for a new social fitness product."),
  C("table-res", "gtm", "Table reservation", "Go-to-market strategy for a restaurant table reservation product."),
  C("ai-sales", "gtm", "Launching an AI sales assistant", "Plan the go-to-market for an AI sales assistant aimed at mid-sized B2B companies."),
  C("tata-loyalty", "gtm", "Tata Group loyalty program", "Design the go-to-market for a single loyalty program across Tata Group brands."),
  C("qc-vendor", "gtm", "Quick commerce vendor management", "Design a vendor management product for a quick-commerce company and plan its rollout."),
  // Pricing
  C("prime", "pricing", "Amazon Prime pricing", "Amazon wants to raise Prime's price in India. Project and recommend the new price."),
  C("jiosaavn", "pricing", "JioSaavn family plan", "Design and price a family plan for JioSaavn."),
  C("netflix", "pricing", "Netflix pricing strategy", "Recommend Netflix's pricing strategy for India."),
  C("vendor-neg", "pricing", "Vendor price negotiation", "A key vendor wants a 15% price increase. How do you approach the negotiation as the PM?"),
  // AI product
  C("phonepe-ai", "ai", "AI support assistant for PhonePe", "Design an AI customer support assistant for PhonePe."),
  C("ai-copilot", "ai", "AI customer-support copilot", "Design an AI copilot that helps human support agents resolve tickets faster."),
  C("knowledge", "ai", "Internal knowledge repository", "Design an AI-powered internal knowledge repository for a 5,000-person company."),
  C("measure-ai", "ai", "Measuring an AI feature", "How would you measure the success of an AI summary feature in an email app?"),
  C("model-select", "ai", "Choosing an LLM", "You're launching AI-generated product descriptions for 2 million sellers. Choose a model and justify quality, latency and cost per task."),
  C("ai-unit-econ", "ai", "Unit economics of an AI product", "An AI tutor charges ₹199/month. Work out whether the unit economics work and what you'd change."),
  // Behavioral
  C("tmay", "behav", "Tell me about yourself", "Tell me about yourself, and why product management?"),
  C("influence", "behav", "Influencing without authority", "Tell me about a time you influenced a team you didn't manage."),
  C("failure", "behav", "A failure", "Tell me about a time you failed. What did you learn?"),
  C("conflict", "behav", "Disagreeing with engineering", "Tell me about a disagreement with an engineer or designer and how you resolved it."),
  C("tradeoff-story", "behav", "A hard prioritization call", "Tell me about a time you had to say no to something important.")
];
