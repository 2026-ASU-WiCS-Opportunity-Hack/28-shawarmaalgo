# World Institute for Action Learning (WIAL) – Product Document

> This is an open doc! Please leave a comment if you have questions. :contentReference[oaicite:0]{index=0}

---

## 🌍 Overview

**Organization:** World Institute for Action Learning (WIAL)  
**Website:** https://wial.org  
**Slack:** #npo-world-institute-for-action-learning  
**Created:** Nov 2, 2025  
**Last Updated:** Mar 23, 2026  

### 🔗 Links
- Main: https://wial.org  
- USA Chapter: https://wial-usa.org  
- Nigeria Chapter: https://wialnigeria.org  

---

## 🎯 Mission & Vision

WIAL is a global non-profit dedicated to advancing **Action Learning methodology**. Founded by Dr. Michael Marquardt based on Reg Revans' work, WIAL certifies Action Learning Coaches and helps organizations solve business challenges while developing leaders.

---

## 🌌 Context

WIAL operates as a **global network of independent chapters**. Each chapter must:
- Maintain **operational independence**
- Follow **global branding standards**

### Certification Levels
- CALC
- PALC
- SALC
- MALC

Requires **ongoing education tracking** for recertification.

---

## 👥 Key Personas

### 1. Chapter Lead / Affiliate Director
**Responsibilities:**
- Manage local chapter website
- Coordinate certification programs
- Manage coach directory
- Report to global WIAL

**Pain Points:**
- No standardized dues system
- Manual website setup
- Inconsistent branding

---

### 2. Certified Action Learning Coach (CALC)
**Needs:**
- Track continuing education
- Maintain coaching records
- Certification renewal reminders
- Access resources & directory

**Pain Points:**
- No centralized tracking
- Scattered resources

---

### 3. Advanced Coaches (PALC/SALC/MALC)
**Needs:**
- Manage cohorts
- Track trainee progress
- Generate certification reports

**Pain Points:**
- Manual tracking
- Poor scalability

---

### 4. Coach-in-Training
**Needs:**
- Clear learning path
- Progress tracking
- Feedback from mentors

**Pain Points:**
- Unclear requirements
- Delayed certificates

---

### 5. Global Administrator
**Needs:**
- Global dashboard
- Push branding updates
- Track certifications

**Pain Points:**
- No centralized visibility
- Manual updates

---

### 6. Content Creator
**Needs:**
- Build courses
- Track performance
- Monetize content

**Pain Points:**
- No CMS
- No analytics

---

## ⚙️ Use Cases

### Website Platform

#### UC1: Create Chapter Site
- Login → Create Chapter → Auto-template → Customize → Publish

#### UC2: Global Branding Updates
- Admin updates template → Auto-deploy to all chapters

#### UC3: Manage Coach Directory
- Add/remove coaches
- Sync local + global directory

#### UC4: Payment & Dues
- Coaches pay via Stripe/PayPal
- System tracks and reports

**Pricing Model (2026):**
- $50 per student enrolled
- $30 per certified coach

---

### eLearning (Informational Only)

#### UC6: Certification Flow
- Enroll → Complete modules → Submit sessions → Approval → Certificate

#### UC7: Recertification
- Track credits → Get reminders → Renew certification

---

## 🚀 Scope & Requirements

### 🖼 Website

#### ✅ P0 – Must Have (MVP)
- Static scroll-based website
- No third-party integrations
- Email contact only

#### Core Features

##### Chapter Provisioning
- One-click site creation
- Subdomain or subdirectory
- Prebuilt templates

##### Role-Based Access
- Super Admin (Global)
- Chapter Lead
- Content Creator
- Coach

##### Branding System
- Global template enforced
- Local content editable
- Auto-updates

##### Payments
- Stripe & PayPal
- Automated receipts
- Reporting dashboard

##### Coach Directory
- Global + chapter views
- Search/filter
- Self-managed profiles

##### Core Pages
- About
- Certification Info
- Directory
- Resources
- Events
- Contact

---

### 🤔 P1 – Should Have
- Multi-language support
- Testimonials & client list
- Event management
- Email campaigns
- Analytics dashboard

---

### 🫣 P2 – Nice to Have
- Mobile app
- Forums
- Job board

---

## 🤖 AI Features (Core to Product)

### AI-1: Cross-Lingual Coach Search (Recommended)
- Multilingual embeddings
- Semantic search across languages
- Supabase pgvector

---

### AI-2: Chapter-in-a-Box
- AI-generated localized content
- Language + cultural adaptation

---

### AI-3: Smart Coach Matching
- Natural language → structured matching

---

### AI-4: Knowledge Engine
- Summarize research + webinars
- Searchable insights + marketing content

---

## ⚡ Recommended Hackathon Plan

1. Build P0 Website (0–12 hrs)
2. Add AI-1 Search (12–16 hrs)
3. Add AI-2 Content Generation (16–20 hrs)

---

## 🌍 Performance Requirements

### Page Size Targets
- Landing page: ≤ 200 KB
- Directory: ≤ 500 KB
- Images: ≤ 800 KB

### Techniques
- AVIF/WebP images
- System fonts only
- <100 KB JS
- Static site generation
- Service worker caching
- Brotli compression

---

## ☁️ Hosting Recommendation
- Cloudflare Pages (free tier)
- Global CDN (330+ locations)
- ~$10/year total cost

---

## 🛠 Technical Recommendations

### Preferred
- Custom-built solution

### Alternative
- WordPress Multisite

**Plugins:**
- WooCommerce
- ACF
- Events Calendar
- WPML
- Gravity Forms

---

## 📊 Success Metrics

- Active chapter sites
- Membership growth
- Payment conversion (>90%)
- Template deployment success

---

## ⚠️ Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Template resistance | Medium | Allow customization |
| Payment issues | High | Extensive testing |
| Content migration | Medium | Phased rollout |
| Hosting cost | Medium | Start small |
| Skill gap | Medium | Documentation |

---

## 📝 Notes (Dec 17, 2025)

### Priorities
- P0: Public website
- P1: Chapter sites
- P2: Admin tools

### Existing Systems
- LMS (unchanged)
- Credly for certifications
- Current tools: WordPress, Brilliant Directories, Constant Contact
