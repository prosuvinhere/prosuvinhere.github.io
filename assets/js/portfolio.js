/* ==========================================================================
   SUVIN SINGH — APPLE SHOWCASE INTERACTION ENGINE
   ========================================================================== */

(function () {
	'use strict';

	/* 1. Apple Scroll-Driven Reveal Physics */
	const revealElements = document.querySelectorAll('.apple-reveal');
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('in-view');
				}
			});
		},
		{ threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
	);
	revealElements.forEach((el) => observer.observe(el));

	/* 2. Active Section Spy in Sticky Local Nav */
	const sections = document.querySelectorAll('section[id]');
	const navLinks = document.querySelectorAll('.apple-nav-links a');
	window.addEventListener('scroll', () => {
		const y = window.scrollY + 180;
		let current = '';
		sections.forEach((sec) => {
			if (y >= sec.offsetTop) {
				current = sec.getAttribute('id');
			}
		});
		navLinks.forEach((a) => {
			a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
		});
	});

	/* 3. Apple Segmented Control Architecture Explorer */
	const architectures = {
		lakehouse: [
			{
				step: 'Stage 01',
				name: 'ERP Ingestion',
				tools: 'SAP · Oracle · AWS S3',
				copy: 'Extracts 5TB+ of daily financial and operational records from enterprise SAP and Oracle ERP systems into AWS S3 raw landing zones.',
				badge: '5TB+ / day'
			},
			{
				step: 'Stage 02',
				name: 'Cloud Compute',
				tools: 'Databricks · PySpark',
				copy: 'Migrated legacy on-premise workloads to AWS cloud architecture and tuned Spark cluster compute policies, cutting pipeline latency by 65%.',
				badge: '$45,000+ saved/yr'
			},
			{
				step: 'Stage 03',
				name: 'Dimensional ELT',
				tools: 'dbt · Snowflake',
				copy: 'Engineered fault-tolerant ELT transformations in dbt and Snowflake with automated data validation checks across 150+ cross-functional teams.',
				badge: '99.9% accuracy'
			},
			{
				step: 'Stage 04',
				name: 'Semantic BI',
				tools: 'Power BI · Data Marts',
				copy: 'Built optimized Power BI semantic models backed by dimensional data marts, eliminating manual analyst reporting across stakeholders.',
				badge: '20+ hrs/wk saved'
			}
		],
		audit: [
			{
				step: 'Stage 01',
				name: 'Isolated Ledger',
				tools: 'AWS S3 · Parquet',
				copy: 'Stores 5M+ rows of confidential financial transactions in partitioned Parquet storage with strict network isolation and zero cloud ingress fees.',
				badge: '5M+ rows'
			},
			{
				step: 'Stage 02',
				name: 'In-Process OLAP',
				tools: 'DuckDB · Python',
				copy: 'Executes vectorized analytical SQL directly over local columnar files using DuckDB, reducing end-to-end query latency by 60%.',
				badge: '-60% latency'
			},
			{
				step: 'Stage 03',
				name: 'Local LLM Audit',
				tools: 'Local LLMs · Embeddings',
				copy: 'Parses unstructured financial entries locally with privacy-preserving LLMs to detect anomalies without external API data leakage.',
				badge: '$0 cloud ingress'
			},
			{
				step: 'Stage 04',
				name: 'Microservices',
				tools: 'Docker · FastAPI',
				copy: 'Containerized anomaly-detection microservices for portable, reproducible execution across hybrid and air-gapped audit environments.',
				badge: 'Dockerized'
			}
		],
		market: [
			{
				step: 'Stage 01',
				name: 'Live API Feeds',
				tools: 'REST APIs · Python',
				copy: 'Streams continuous pricing and inventory updates across 1,000+ daily market listings with automated rate-limit handling.',
				badge: '1,000+ daily'
			},
			{
				step: 'Stage 02',
				name: 'Airflow DAGs',
				tools: 'Apache Airflow',
				copy: 'Orchestrates automated ingestion, deduplication, and normalization workflows with SLA monitoring and idempotent task retries.',
				badge: 'Zero-touch DAGs'
			},
			{
				step: 'Stage 03',
				name: 'Redis Acceleration',
				tools: 'Redis · Indexed Keys',
				copy: 'Integrates an in-memory Redis caching layer and indexed query patterns to sustain a 300% concurrent traffic spike.',
				badge: '300% traffic spike'
			},
			{
				step: 'Stage 04',
				name: 'Sub-Second Serve',
				tools: 'FastAPI · Streamlit',
				copy: 'Delivers real-time market intelligence and analytical comparisons with sub-second response times.',
				badge: '< 1s latency'
			}
		]
	};

	let currentArch = 'lakehouse';
	let currentStage = 0;

	const stageGrid = document.getElementById('arch-stage-grid');
	const spotlightCopy = document.getElementById('spotlight-copy');
	const spotlightBadge = document.getElementById('spotlight-badge');

	function renderArch() {
		if (!stageGrid) return;
		const stages = architectures[currentArch];
		stageGrid.innerHTML = stages
			.map(
				(s, i) => `
			<div class="arch-stage-card ${i === currentStage ? 'active' : ''}" data-idx="${i}">
				<span class="stage-index">${s.step}</span>
				<div class="stage-name">${s.name}</div>
				<div class="stage-tools">${s.tools}</div>
			</div>
		`
			)
			.join('');

		const active = stages[currentStage];
		if (spotlightCopy) spotlightCopy.textContent = active.copy;
		if (spotlightBadge) spotlightBadge.textContent = active.badge;

		stageGrid.querySelectorAll('.arch-stage-card').forEach((card) => {
			card.addEventListener('click', () => {
				currentStage = parseInt(card.getAttribute('data-idx'), 10);
				renderArch();
			});
		});
	}

	document.querySelectorAll('.seg-btn').forEach((btn) => {
		btn.addEventListener('click', () => {
			document.querySelectorAll('.seg-btn').forEach((b) => b.classList.remove('active'));
			btn.classList.add('active');
			currentArch = btn.getAttribute('data-arch');
			currentStage = 0;
			renderArch();
		});
	});

	renderArch();

	/* 4. Copy Email Button */
	const copyBtn = document.getElementById('copy-email-btn');
	if (copyBtn) {
		const orig = copyBtn.innerHTML;
		copyBtn.addEventListener('click', () => {
			if (navigator.clipboard) {
				navigator.clipboard.writeText('suvinsingh.work@gmail.com').then(() => {
					copyBtn.innerHTML = '<span>Copied suvinsingh.work@gmail.com ✓</span>';
					setTimeout(() => {
						copyBtn.innerHTML = orig;
					}, 2000);
				});
			}
		});
	}

	/* 5. Contact Form AJAX */
	const contactForm = document.getElementById('apple-contact-form');
	const statusEl = document.getElementById('apple-form-status');
	if (contactForm) {
		contactForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			const btn = contactForm.querySelector('button[type="submit"]');
			if (btn) btn.textContent = 'Sending...';
			try {
				const res = await fetch('https://api.web3forms.com/submit', {
					method: 'POST',
					body: new FormData(contactForm)
				});
				if (res.ok) {
					if (statusEl) statusEl.textContent = 'Message sent. Thank you.';
					contactForm.reset();
				} else {
					if (statusEl) statusEl.textContent = 'Could not send. Email suvinsingh.work@gmail.com directly.';
				}
			} catch (_) {
				if (statusEl) statusEl.textContent = 'Network error. Email suvinsingh.work@gmail.com directly.';
			} finally {
				if (btn) btn.textContent = 'Send Message';
			}
		});
	}
})();
