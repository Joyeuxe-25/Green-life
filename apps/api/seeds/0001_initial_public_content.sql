-- Phase 15B initial public content seed for local preview.
-- Safe to rerun: stable IDs/keys use ON CONFLICT updates.
-- This seed intentionally stores content in D1 tables, not in React pages.

PRAGMA foreign_keys = ON;

INSERT INTO content_blocks (
  id, page_key, block_key, block_type, eyebrow, title, subtitle, summary, body,
  cta_label, cta_href, secondary_cta_label, secondary_cta_href, image_url,
  display_order, status, created_at, updated_at
) VALUES
('cb-home-hero', 'home', 'hero', 'hero', 'Green Life Rwanda', 'Community action for people and nature', 'Sustainable agroforestry, ecosystem restoration, and resilient livelihoods across Rwanda.', 'Green Life Rwanda works with communities to restore ecosystems, improve food security, and strengthen livelihoods through practical agroforestry solutions.', 'Green Life Rwanda is a community-based Rwandan non-profit organization focused on environmental protection, sustainable agroforestry, and livelihood improvement for small-scale farmers, women, youth, and vulnerable communities.', 'Explore programs', '/programs', 'Support our work', '/donate', '/public/media/file/enhanced-community-seedling-training', 1, 'published', datetime('now'), datetime('now')),
('cb-home-mission', 'home', 'mission-preview', 'section', 'Our mission', 'Protecting the environment while improving livelihoods', NULL, 'GLR promotes sustainable agroforestry practices with communities across Rwanda.', 'Green Life Rwanda protects the environment and improves the livelihoods of small-scale farmers by promoting sustainable agroforestry practices in communities across Rwanda.', 'About GLR', '/about', 'View impact', '/impact', '/public/media/file/enhanced-tree-nursery-landscape', 2, 'published', datetime('now'), datetime('now')),
('cb-home-cta', 'home', 'support-cta', 'cta', 'Get involved', 'Help communities restore land and grow resilient livelihoods', NULL, 'Support farmer training, tree planting, school greening, and community-led restoration work.', 'Your support helps Green Life Rwanda expand practical climate and livelihood solutions with smallholder farmers, women, youth, and vulnerable communities.', 'Donate', '/donate', 'Contact us', '/contact', '/public/media/file/enhanced-fruit-tree-plantation', 9, 'published', datetime('now'), datetime('now')),

('cb-about-who-we-are', 'about', 'who-we-are', 'section', 'Who we are', 'A community-based organization rooted in practical local solutions', NULL, 'GLR works closely with smallholder farmers, women, and youth to address climate change, food insecurity, and poverty.', 'Green Life Rwanda is a community-based non-profit committed to environmental protection and sustainable livelihood improvement for vulnerable populations. The organization works closely with smallholder farmers, women, and youth through practical local solutions addressing climate change, food insecurity, and poverty.', 'See programs', '/programs', NULL, NULL, NULL, 1, 'draft', datetime('now'), datetime('now')),
('cb-about-mission', 'about', 'mission', 'section', 'Mission', 'Protect the environment and improve livelihoods', NULL, 'Green Life Rwanda promotes sustainable agroforestry practices in communities across Rwanda.', 'Green Life Rwanda''s mission is to protect the environment and improve the livelihoods of small-scale farmers by promoting sustainable agroforestry practices in communities across Rwanda.', NULL, NULL, NULL, NULL, '/public/media/file/enhanced-tree-nursery-landscape', 2, 'published', datetime('now'), datetime('now')),
('cb-about-vision', 'about', 'vision', 'section', 'Vision', 'People and the environment thriving together', NULL, 'GLR envisions harmony between people and nature.', 'The vision is a world where people and the environment coexist in harmony without compromising one another.', NULL, NULL, NULL, NULL, NULL, 3, 'published', datetime('now'), datetime('now')),
('cb-about-history', 'about', 'history', 'section', 'History', 'Founded by agroforestry students to respond to rural challenges', NULL, 'GLR was founded in 2017 and legally registered in 2021.', 'Green Life Rwanda was founded in 2017 and legally registered in 2021. It was established by students from the former Higher Institute of Agriculture and Animal Husbandry, ISAE Busogo, specializing in agroforestry. The founding motivation came from rural smallholder farmers'' challenges, including drying streams, declining food security, and longer distances to collect firewood for fuel and fencing. GLR is based in Gisagara District, Southern Province, and intends to expand its activities nationwide.', 'Meet our partners', '/partners', 'Get involved', '/get-involved', NULL, 4, 'published', datetime('now'), datetime('now')),

('cb-programs-intro', 'programs', 'intro', 'hero', 'What we do', 'Programs built around agroforestry, climate action, youth, and livelihoods', NULL, 'Green Life Rwanda organizes its work around four practical program pillars that help communities restore land and improve livelihoods.', 'The program areas move from awareness to action: raising seedlings, planting trees, training farmers, supporting environmental clubs, and helping communities build income-generating practices that also protect natural resources.', 'View projects', '/projects', 'See impact', '/impact', '/public/media/file/enhanced-tree-planting-demonstration', 1, 'published', datetime('now'), datetime('now')),
('cb-projects-intro', 'projects', 'intro', 'hero', 'Projects', 'Community-led restoration projects in action', NULL, 'Explore practical Green Life Rwanda projects supporting restoration, farmer training, environmental clubs, and school greening.', 'Projects connect community training, tree planting, nurseries, youth environmental education, and sustainable livelihood action in the field.', 'View impact', '/impact', 'Support projects', '/donate', '/public/media/file/enhanced-tree-planting-demonstration', 1, 'published', datetime('now'), datetime('now')),

('cb-impact-intro', 'impact', 'intro', 'hero', 'Impact', 'Community restoration measured in trees, land, training, and nurseries', NULL, 'Green Life Rwanda tracks practical outcomes from agroforestry and community restoration work.', 'The initial impact snapshot reflects approved numbers from Green Life Rwanda content: farmers trained, trees planted, hectares restored, and permanent nurseries established for sustainability.', 'View projects', '/projects', 'Support impact', '/donate', '/public/media/file/enhanced-farmers-with-grevillea-seedlings', 1, 'published', datetime('now'), datetime('now')),

('cb-contact-intro', 'contact', 'intro', 'hero', 'Contact', 'Connect with Green Life Rwanda', NULL, 'Reach out to discuss partnerships, visits, volunteering, donations, and community environmental action.', 'Green Life Rwanda welcomes contact from communities, partners, supporters, and institutions interested in sustainable agroforestry, environmental protection, and resilient livelihoods. Official direct contact details should be confirmed before production launch.', 'Get involved', '/get-involved', 'Support our work', '/donate', '/public/media/file/enhanced-community-listening-session', 1, 'published', datetime('now'), datetime('now')),

('cb-donate-intro', 'donate', 'intro', 'hero', 'Donate', 'Support community-led restoration and livelihoods', NULL, 'Donations help expand farmer training, tree planting, school greening, and environmental club support.', 'Green Life Rwanda uses support to strengthen sustainable agroforestry, restore degraded land, improve food security, and build resilient livelihoods with communities. Official payment and bank details should be confirmed before production launch.', 'Contact GLR', '/contact', 'Explore projects', '/projects', '/public/media/file/enhanced-fruit-tree-plantation', 1, 'published', datetime('now'), datetime('now')),

('cb-get-involved-intro', 'get-involved', 'intro', 'hero', 'Get involved', 'Support, visit, volunteer, intern, or partner with GLR', NULL, 'There are multiple ways to participate in Green Life Rwanda''s environmental and livelihood work.', 'Get involved through support, visits, jobs, internships, volunteering, partnerships, and collaboration. Until a dedicated opportunities system is added, inquiries can be handled through contact messages.', 'Contact us', '/contact', 'Donate', '/donate', '/public/media/file/enhanced-youth-community-seedling-training', 1, 'published', datetime('now'), datetime('now')),
('cb-partners-intro', 'partners', 'intro', 'hero', 'Partners', 'Working with partners for community restoration', NULL, 'Green Life Rwanda works with partners who support environmental protection, agroforestry, and community livelihood action.', 'Partnerships help expand training, tree planting, school greening, and locally led restoration work across communities.', 'Contact us', '/contact', 'Support our work', '/donate', '/public/media/file/enhanced-community-seedling-training', 1, 'published', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET
  page_key = excluded.page_key,
  block_key = excluded.block_key,
  block_type = excluded.block_type,
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  subtitle = excluded.subtitle,
  summary = excluded.summary,
  body = excluded.body,
  cta_label = excluded.cta_label,
  cta_href = excluded.cta_href,
  secondary_cta_label = excluded.secondary_cta_label,
  secondary_cta_href = excluded.secondary_cta_href,
  image_url = excluded.image_url,
  display_order = excluded.display_order,
  status = excluded.status,
  updated_at = datetime('now');

INSERT INTO programs (
  id, title, slug, summary, body, icon_name, display_order, status, created_at, updated_at
) VALUES
('program-agroforestry-promotion', 'Agroforestry Promotion', 'agroforestry-promotion', 'Community tree nurseries, seedling distribution, livestock support, and farmer training in good agricultural practices.', 'Green Life Rwanda promotes agroforestry as a practical, community-driven, impact-oriented solution for small-scale farmers. Activities include community-based tree nursery development, tree seedling distribution and planting, small livestock support for soil fertility, and training in agroforestry and good agricultural practices. The expected result is that communities can grow more, earn more, and protect the environment.', 'Sprout', 1, 'published', datetime('now'), datetime('now')),
('program-climate-action', 'Climate Action', 'climate-action', 'Climate-smart agroforestry, landscape restoration, sustainable agriculture, youth leadership, and women empowerment for resilience.', 'Climate action is central to GLR''s work. Activities include climate-smart agroforestry, community tree planting and landscape restoration, sustainable agriculture practices such as composting, organic pest control, mulching, and water conservation, youth engagement in climate leadership, women empowerment for climate resilience, environmental awareness, and advocacy.', 'Leaf', 2, 'published', datetime('now'), datetime('now')),
('program-youth-environmental-education', 'Youth Environmental Education', 'youth-environmental-education', 'School environmental clubs, fruit tree orchards, vegetable gardens, and mentoring for teachers and youth leaders.', 'Green Life Rwanda works with school environmental clubs to help youth become environmental champions. Activities include training youth on environmental protection, supporting schools to establish and maintain fruit tree orchards and vegetable gardens, and training and mentoring teachers as environmental club leaders.', 'GraduationCap', 3, 'published', datetime('now'), datetime('now')),
('program-community-livelihoods', 'Community Livelihoods', 'community-livelihoods', 'Savings groups, business skills, vegetable gardens, and practical agriculture skills that support income and nutrition.', 'Green Life Rwanda supports farmer environmental clubs with practical skills for environmental protection and income generation. Key interventions include Village Savings and Loan Associations methodology, business skills and entrepreneurship, vegetable gardens for income generation and household nutrition, and good agricultural practices including organic pesticides and organic fertilizers.', 'Handshake', 4, 'published', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET
  title = excluded.title,
  slug = excluded.slug,
  summary = excluded.summary,
  body = excluded.body,
  icon_name = excluded.icon_name,
  display_order = excluded.display_order,
  status = excluded.status,
  updated_at = datetime('now');

INSERT INTO impact_stats (
  id, label, value, suffix, description, display_order, status, created_at, updated_at
) VALUES
('impact-farmers-trained', 'Smallholder farmers trained', '350', NULL, 'Farmers trained in agroforestry and environmental protection.', 1, 'published', datetime('now'), datetime('now')),
('impact-trees-planted', 'Trees planted', '329,425', NULL, 'Trees planted across Gisagara and Bugesera Districts.', 2, 'published', datetime('now'), datetime('now')),
('impact-hectares-restored', 'Hectares restored', '365', NULL, 'Hectares of degraded land restored in Gisagara and Rutsiro Districts.', 3, 'published', datetime('now'), datetime('now')),
('impact-permanent-nurseries', 'Permanent tree nurseries', 'Established', NULL, 'Permanent tree nurseries established to ensure sustainability.', 4, 'published', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET
  label = excluded.label,
  value = excluded.value,
  suffix = excluded.suffix,
  description = excluded.description,
  display_order = excluded.display_order,
  status = excluded.status,
  updated_at = datetime('now');

INSERT INTO projects (
  id, title, slug, summary, description, district, sector, start_date, end_date,
  status, category, impact_summary, created_at, updated_at, deleted_at
) VALUES
('project-mushonyi-restoration', 'Agroforestry Project for Mushonyi Community-Led Restoration', 'agroforestry-project-for-mushonyi-community-led-restoration', 'Restoring degraded land in Mushonyi and Boneza sectors through sustainable land management and selected agroforestry tree species.', 'This project targets Mushonyi and Boneza sectors of Rutsiro District. It aims to restore 200 hectares of degraded land using sustainable land management and eight selected agroforestry tree species. It targets 357 smallholder farmers through training, seedling distribution, and technical support.', 'Rutsiro', 'Mushonyi and Boneza', NULL, NULL, 'active', 'Agroforestry', '200 hectares targeted for restoration and 357 smallholder farmers targeted through training, seedling distribution, and technical support.', datetime('now'), datetime('now'), NULL),
('project-nyanza-environmental-clubs', 'Enabling Environmental Clubs in Sustainable Agroforestry', 'enabling-environmental-clubs-in-sustainable-agroforestry', 'Strengthening environmental clubs in Nyanza Sector through tree nursery management, agroforestry, and climate-smart agriculture.', 'This project strengthens environmental clubs in Nyanza Sector, Gisagara District. It trains 360 environmental club members in tree nursery management, agroforestry, and climate-smart agriculture. It includes one community tree nursery, 42 agroforestry species, and 180 small livestock for selected members.', 'Gisagara', 'Nyanza', NULL, NULL, 'active', 'Agroforestry', '360 environmental club members targeted, one community tree nursery, 42 agroforestry species, and 180 small livestock.', datetime('now'), datetime('now'), NULL),
('project-school-greening', 'School Greening and Environmental Education Project', 'school-greening-and-environmental-education-project', 'Empowering youth through environmental clubs, fruit tree planting, school gardens, and climate action education.', 'This project empowers 600 youth from environmental clubs in five schools in Nyanza Sector, Gisagara District. It focuses on fruit tree planting, school vegetable gardens, sustainable agroforestry, climate action, nutrition, and environmental stewardship.', 'Gisagara', 'Nyanza', NULL, NULL, 'active', 'Youth Environmental Education', '600 youth targeted through environmental clubs in five schools.', datetime('now'), datetime('now'), NULL)
ON CONFLICT(id) DO UPDATE SET
  title = excluded.title,
  slug = excluded.slug,
  summary = excluded.summary,
  description = excluded.description,
  district = excluded.district,
  sector = excluded.sector,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  status = excluded.status,
  category = excluded.category,
  impact_summary = excluded.impact_summary,
  deleted_at = NULL,
  updated_at = datetime('now');

INSERT INTO partners (
  id, name, slug, website_url, description, display_order, status, is_text_only,
  created_at, updated_at, deleted_at
) VALUES
('partner-world-connect', 'World Connect', 'world-connect', 'https://worldconnect-us.org/power-center/rwanda', 'Green Life Rwanda partner.', 1, 'active', 0, datetime('now'), datetime('now'), NULL),
('partner-biocoor', 'Biocoor', 'biocoor', 'https://biocoor.org.rw/', 'Green Life Rwanda partner.', 2, 'active', 0, datetime('now'), datetime('now'), NULL),
('partner-segal-family-foundation', 'Segal Family Foundation', 'segal-family-foundation', 'https://www.segalfamilyfoundation.org/', 'Green Life Rwanda partner.', 3, 'active', 0, datetime('now'), datetime('now'), NULL),
('partner-rgb', 'RGB', 'rgb', 'https://www.rgb.rw/', 'Green Life Rwanda partner.', 4, 'active', 0, datetime('now'), datetime('now'), NULL),
('partner-bridge-of-hope', 'Bridge of Hope', 'bridge-of-hope', 'https://bridgeofhope.org.rw/', 'Green Life Rwanda partner.', 5, 'active', 0, datetime('now'), datetime('now'), NULL),
('partner-fmi-ubumuntu', 'FMI Ubumuntu', 'fmi-ubumuntu', 'https://www.friendsofmotherland.org/', 'Green Life Rwanda partner.', 6, 'active', 0, datetime('now'), datetime('now'), NULL),
('partner-restore-local', 'Restore Local', 'restore-local', 'https://restorelocal.org/', 'Green Life Rwanda partner.', 7, 'active', 0, datetime('now'), datetime('now'), NULL)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  slug = excluded.slug,
  website_url = excluded.website_url,
  description = excluded.description,
  display_order = excluded.display_order,
  status = excluded.status,
  is_text_only = excluded.is_text_only,
  deleted_at = NULL,
  updated_at = datetime('now');

INSERT INTO site_settings (
  key, group_key, label, value, field_type, updated_at
) VALUES
('site.name', 'general', 'Site name', 'Green Life Rwanda', 'text', datetime('now')),
('site.short_name', 'general', 'Short site name', 'GLR', 'text', datetime('now')),
('site.tagline', 'general', 'Site tagline', 'Community action for people and nature', 'text', datetime('now')),
('footer.summary', 'footer', 'Footer summary', 'Empowering communities to conserve the environment and improve livelihoods across Rwanda.', 'textarea', datetime('now')),
('footer.copyright', 'footer', 'Footer copyright', '© 2026 Green Life Rwanda. All rights reserved.', 'text', datetime('now')),
('contact.email', 'contact', 'Email', 'greenforliferwanda@gmail.com', 'email', datetime('now')),
('contact.phone', 'contact', 'Phone', '+250-788-487-932', 'text', datetime('now')),
('contact.location', 'contact', 'Location', 'Huye, South Province, Rwanda', 'text', datetime('now')),
('contact.address', 'contact', 'Address', 'Huye, South Province, Rwanda', 'text', datetime('now')),
('site.logo_url', 'media', 'Site logo URL', '/public/media/file/media-green-life-logo-transparent-webp', 'url', datetime('now')),
('site.footer_logo_url', 'media', 'Footer logo URL', '/public/media/file/media-green-life-logo-footer-transparent-png', 'url', datetime('now')),
('site.favicon_url', 'media', 'Favicon URL', '/public/media/file/media-green-life-favicon-ico', 'url', datetime('now')),
('site.favicon_32_url', 'media', 'Favicon 32 URL', '/public/media/file/media-green-life-favicon-32-png', 'url', datetime('now')),
('site.favicon_48_url', 'media', 'Favicon 48 URL', '/public/media/file/media-green-life-favicon-48-png', 'url', datetime('now')),
('site.apple_touch_icon_url', 'media', 'Apple touch icon URL', '/public/media/file/media-green-life-apple-touch-icon-png', 'url', datetime('now')),
('site.icon_192_url', 'media', 'PWA icon 192 URL', '/public/media/file/media-green-life-favicon-192-png', 'url', datetime('now')),
('site.icon_512_url', 'media', 'PWA icon 512 URL', '/public/media/file/media-green-life-favicon-512-png', 'url', datetime('now')),
('contact.details_status', 'contact', 'Contact details status', 'Footer contact details seeded from approved Vercel reference content for local preview.', 'textarea', datetime('now')),
('donation.details_status', 'donation', 'Donation details status', 'Official payment and bank details should be confirmed before production launch.', 'textarea', datetime('now'))
ON CONFLICT(key) DO UPDATE SET
  group_key = excluded.group_key,
  label = excluded.label,
  value = excluded.value,
  field_type = excluded.field_type,
  updated_at = datetime('now');
