/* ==========================================================================
   SUVIN SINGH — INTERACTIVE DATA ENGINEERING ENGINE (portfolio.js)
   Powers: Distributed Data Network Canvas, Architecture Simulator,
   Lakehouse SQL/CLI Terminal, Skill Matrix, Command Palette & Telemetry
   ========================================================================== */

(function () {
	'use strict';

	/* ----------------------------------------------------------------------
	   1. DISTRIBUTED DATA NETWORK & STREAMING PACKET CANVAS
	   ---------------------------------------------------------------------- */
	const canvas = document.getElementById('network-canvas');
	if (canvas) {
		const ctx = canvas.getContext('2d');
		let width = (canvas.width = window.innerWidth);
		let height = (canvas.height = window.innerHeight);

		const nodes = [];
		const packets = [];
		const NODE_COUNT = Math.min(68, Math.floor((width * height) / 22000));
		const MAX_DIST = 165;
		const mouse = { x: -9999, y: -9999, radius: 150 };

		window.addEventListener('resize', () => {
			width = canvas.width = window.innerWidth;
			height = canvas.height = window.innerHeight;
		});

		window.addEventListener('mousemove', (e) => {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
		});

		window.addEventListener('mouseout', () => {
			mouse.x = -9999;
			mouse.y = -9999;
		});

		const palette = ['#38bdf8', '#6366f1', '#10b981'];

		for (let i = 0; i < NODE_COUNT; i++) {
			nodes.push({
				x: Math.random() * width,
				y: Math.random() * height,
				vx: (Math.random() - 0.5) * 0.55,
				vy: (Math.random() - 0.5) * 0.55,
				r: Math.random() * 2 + 1.4,
				color: palette[i % palette.length]
			});
		}

		function spawnPacket(n1, n2) {
			if (packets.length > 18) return;
			packets.push({
				x1: n1.x,
				y1: n1.y,
				x2: n2.x,
				y2: n2.y,
				progress: 0,
				speed: 0.018 + Math.random() * 0.02,
				color: Math.random() > 0.5 ? '#38bdf8' : '#10b981'
			});
		}

		function animateCanvas() {
			ctx.clearRect(0, 0, width, height);

			for (let i = 0; i < nodes.length; i++) {
				const n = nodes[i];
				n.x += n.vx;
				n.y += n.vy;

				if (n.x < 0 || n.x > width) n.vx *= -1;
				if (n.y < 0 || n.y > height) n.vy *= -1;

				// Subtle mouse interaction
				const dxMouse = n.x - mouse.x;
				const dyMouse = n.y - mouse.y;
				const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
				if (distMouse < mouse.radius && distMouse > 0) {
					const force = (mouse.radius - distMouse) / mouse.radius;
					n.x += (dxMouse / distMouse) * force * 1.1;
					n.y += (dyMouse / distMouse) * force * 1.1;
				}

				// Draw node
				ctx.beginPath();
				ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
				ctx.fillStyle = n.color;
				ctx.fill();

				// Connect edges
				for (let j = i + 1; j < nodes.length; j++) {
					const n2 = nodes[j];
					const dx = n.x - n2.x;
					const dy = n.y - n2.y;
					const dist = Math.sqrt(dx * dx + dy * dy);

					if (dist < MAX_DIST) {
						const alpha = (1 - dist / MAX_DIST) * 0.22;
						ctx.beginPath();
						ctx.moveTo(n.x, n.y);
						ctx.lineTo(n2.x, n2.y);
						ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
						ctx.lineWidth = 1;
						ctx.stroke();

						if (Math.random() < 0.0005) {
							spawnPacket(n, n2);
						}
					}
				}
			}

			// Draw streaming data packets along edges
			for (let i = packets.length - 1; i >= 0; i--) {
				const p = packets[i];
				p.progress += p.speed;
				if (p.progress >= 1) {
					packets.splice(i, 1);
					continue;
				}
				const cx = p.x1 + (p.x2 - p.x1) * p.progress;
				const cy = p.y1 + (p.y2 - p.y1) * p.progress;

				ctx.beginPath();
				ctx.arc(cx, cy, 2.6, 0, Math.PI * 2);
				ctx.fillStyle = p.color;
				ctx.shadowBlur = 8;
				ctx.shadowColor = p.color;
				ctx.fill();
				ctx.shadowBlur = 0;
			}

			requestAnimationFrame(animateCanvas);
		}

		animateCanvas();
	}

	/* ----------------------------------------------------------------------
	   2. SCROLL PROGRESS, STICKY NAV & ACTIVE SECTION SPY
	   ---------------------------------------------------------------------- */
	const progressBar = document.getElementById('scroll-progress');
	const navbar = document.querySelector('.navbar');
	const sections = document.querySelectorAll('section[id]');
	const navLinks = document.querySelectorAll('.nav-links a');

	window.addEventListener('scroll', () => {
		const scrollTop = window.scrollY;
		const docHeight = document.documentElement.scrollHeight - window.innerHeight;
		if (progressBar && docHeight > 0) {
			progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
		}
		if (navbar) {
			navbar.classList.toggle('scrolled', scrollTop > 40);
		}

		let currentId = '';
		sections.forEach((sec) => {
			const top = sec.offsetTop - 160;
			if (scrollTop >= top) {
				currentId = sec.getAttribute('id');
			}
		});
		navLinks.forEach((link) => {
			link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
		});
	});

	// Mobile menu toggle
	const mobileBtn = document.getElementById('mobile-menu-btn');
	const navList = document.getElementById('nav-links');
	if (mobileBtn && navList) {
		mobileBtn.addEventListener('click', () => {
			navList.classList.toggle('mobile-open');
		});
		navList.querySelectorAll('a').forEach((a) => {
			a.addEventListener('click', () => navList.classList.remove('mobile-open'));
		});
	}

	/* ----------------------------------------------------------------------
	   3. TYPEWRITER ROLE CYCLER
	   ---------------------------------------------------------------------- */
	const roleEl = document.getElementById('typewriter-role');
	const roles = [
		'Data Associate Engineer @ Deloitte',
		'AWS Certified Solutions Architect',
		'Terabyte-Scale ELT & Lakehouse Engineer',
		'PySpark • Databricks • dbt • Snowflake',
		'Distributed Cloud & Pipeline Architect'
	];
	let roleIdx = 0;
	let charIdx = 0;
	let deleting = false;

	function tickTypewriter() {
		if (!roleEl) return;
		const current = roles[roleIdx];
		if (!deleting) {
			charIdx++;
			roleEl.textContent = current.slice(0, charIdx);
			if (charIdx === current.length) {
				deleting = true;
				setTimeout(tickTypewriter, 2100);
				return;
			}
			setTimeout(tickTypewriter, 52);
		} else {
			charIdx--;
			roleEl.textContent = current.slice(0, charIdx);
			if (charIdx === 0) {
				deleting = false;
				roleIdx = (roleIdx + 1) % roles.length;
				setTimeout(tickTypewriter, 320);
				return;
			}
			setTimeout(tickTypewriter, 26);
		}
	}
	tickTypewriter();

	/* ----------------------------------------------------------------------
	   4. REVEAL ON SCROLL & ANIMATED KPI COUNTERS
	   ---------------------------------------------------------------------- */
	const revealEls = document.querySelectorAll('.reveal');
	const revealObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
				}
			});
		},
		{ threshold: 0.12 }
	);
	revealEls.forEach((el) => revealObserver.observe(el));

	const counterEls = document.querySelectorAll('[data-count]');
	const counterObserver = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const el = entry.target;
				const target = parseFloat(el.getAttribute('data-count'));
				const prefix = el.getAttribute('data-prefix') || '';
				const suffix = el.getAttribute('data-suffix') || '';
				const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
				const duration = 1500;
				const start = performance.now();

				function updateCount(now) {
					const elapsed = Math.min((now - start) / duration, 1);
					const eased = 1 - Math.pow(1 - elapsed, 3);
					const val = (target * eased).toFixed(decimals);
					el.textContent = `${prefix}${val}${suffix}`;
					if (elapsed < 1) {
						requestAnimationFrame(updateCount);
					}
				}
				requestAnimationFrame(updateCount);
				obs.unobserve(el);
			});
		},
		{ threshold: 0.4 }
	);
	counterEls.forEach((el) => counterObserver.observe(el));

	/* ----------------------------------------------------------------------
	   5. RADIAL SPOTLIGHT HOVER ON CARDS
	   ---------------------------------------------------------------------- */
	document.querySelectorAll('.exp-card, .project-card, .profile-card').forEach((card) => {
		card.addEventListener('mousemove', (e) => {
			const rect = card.getBoundingClientRect();
			card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
			card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
		});
	});

	/* ----------------------------------------------------------------------
	   6. INTERACTIVE LAKEHOUSE PIPELINE ARCHITECTURE SIMULATOR
	   ---------------------------------------------------------------------- */
	const archData = {
		deloitte: {
			nodes: [
				{
					step: 'STAGE 01 // INGEST',
					title: 'Enterprise ERP Sources',
					tech: 'SAP ERP • Oracle ERP • AWS S3',
					desc: 'High-volume transactional extraction across financial & operational ERP tables.',
					inspectorTitle: 'Stage 01: Enterprise ERP Ingestion Layer',
					inspectorDetail:
						'Extracts 5TB+ of daily financial and operational records from SAP and Oracle ERP systems into AWS S3 raw landing zones with schema drift detection and zero data loss.',
					stat1Val: '5TB+ / Day',
					stat1Lbl: 'Daily Ingestion Volume',
					stat2Val: 'SAP + Oracle',
					stat2Lbl: 'Integrated ERP Core'
				},
				{
					step: 'STAGE 02 // COMPUTE',
					title: 'Distributed Lakehouse',
					tech: 'Databricks • PySpark • Delta Lake',
					desc: 'Cluster-tuned distributed PySpark processing & ACID Delta Lake tables on AWS.',
					inspectorTitle: 'Stage 02: AWS & Databricks Compute Engine',
					inspectorDetail:
						'Migrated legacy on-premise workloads to AWS cloud architecture and tuned Databricks Spark cluster compute policies, slashing end-to-end pipeline latency by 65% and saving $45,000+ annually.',
					stat1Val: '-65% Latency',
					stat1Lbl: 'Cluster Compute Optimization',
					stat2Val: '$45,000+ / yr',
					stat2Lbl: 'Recurring Cloud Savings'
				},
				{
					step: 'STAGE 03 // TRANSFORM',
					title: 'Dimensional Modeling',
					tech: 'dbt • Snowflake • Data Quality',
					desc: 'Modular dbt transformations with automated validation & Star/Snowflake schemas.',
					inspectorTitle: 'Stage 03: dbt & Snowflake Transformation Layer',
					inspectorDetail:
						'Engineered fault-tolerant ELT models in dbt and Snowflake with automated data quality assertions and reconciliation checks, raising end-to-end financial data accuracy to 99.9%.',
					stat1Val: '99.9% Accuracy',
					stat1Lbl: 'Automated Validation SLA',
					stat2Val: '150+ Teams',
					stat2Lbl: 'Cross-Functional Consumers'
				},
				{
					step: 'STAGE 04 // SERVE',
					title: 'BI & Semantic Marts',
					tech: 'Power BI • Tableau • Data Marts',
					desc: 'Optimized semantic models eliminating manual reporting across stakeholders.',
					inspectorTitle: 'Stage 04: Power BI Semantic & Analytics Layer',
					inspectorDetail:
						'Built high-performance Power BI semantic models backed by dimensional data marts, eliminating manual spreadsheet reporting and reclaiming 20+ stakeholder hours every week.',
					stat1Val: '20+ hrs / wk',
					stat1Lbl: 'Stakeholder Time Reclaimed',
					stat2Val: 'Sub-Second',
					stat2Lbl: 'Executive Dashboard Queries'
				}
			]
		},
		audit: {
			nodes: [
				{
					step: 'STAGE 01 // STORAGE',
					title: 'Confidential Financial Lake',
					tech: 'AWS S3 • Parquet • Isolated VPC',
					desc: '5M+ rows of sensitive audit & financial transaction logs in partitioned storage.',
					inspectorTitle: 'Stage 01: Isolated Financial Audit Storage',
					inspectorDetail:
						'Stores 5M+ rows of confidential financial transactions in partitioned Parquet datasets with strict isolation so sensitive audit payloads never require public cloud API egress.',
					stat1Val: '5M+ Rows',
					stat1Lbl: 'Confidential Audit Records',
					stat2Val: '$0 Ingress',
					stat2Lbl: 'Cloud Data Ingress Cost'
				},
				{
					step: 'STAGE 02 // ENGINE',
					title: 'In-Process OLAP Compute',
					tech: 'DuckDB • Vectorized SQL • Python',
					desc: 'Zero-dependency analytical SQL execution directly over columnar files.',
					inspectorTitle: 'Stage 02: DuckDB Local-Compute Engine',
					inspectorDetail:
						'Leveraged DuckDB vectorized analytical execution to parse and aggregate multi-million row financial ledgers locally, cutting analytical query latency by 60%.',
					stat1Val: '-60% Latency',
					stat1Lbl: 'Analytical Query Speedup',
					stat2Val: 'Columnar OLAP',
					stat2Lbl: 'Vectorized Execution'
				},
				{
					step: 'STAGE 03 // AI AUDIT',
					title: 'Local LLM Anomaly Engine',
					tech: 'Local LLMs • Python • Embeddings',
					desc: 'Privacy-preserving semantic parsing & anomaly detection without external APIs.',
					inspectorTitle: 'Stage 03: Local LLM Semantic Audit Parser',
					inspectorDetail:
						'Coupled local LLMs with DuckDB analytical pipelines to flag anomalous financial entries and unstructured invoice discrepancies while maintaining 100% data sovereignty.',
					stat1Val: '100% Private',
					stat1Lbl: 'Zero External API Leakage',
					stat2Val: 'Automated',
					stat2Lbl: 'Anomaly Classification'
				},
				{
					step: 'STAGE 04 // DEPLOY',
					title: 'Containerized Microservices',
					tech: 'Docker • FastAPI • CI/CD',
					desc: 'Reproducible Docker microservices for real-time audit scoring & reporting.',
					inspectorTitle: 'Stage 04: Containerized Microservice Runtime',
					inspectorDetail:
						'Packaged anomaly detection and audit scoring engines as isolated Docker microservices, enabling portable deployment across air-gapped or hybrid cloud environments.',
					stat1Val: 'Dockerized',
					stat1Lbl: 'Portable Microservices',
					stat2Val: '60% Faster',
					stat2Lbl: 'End-to-End Audit Cycle'
				}
			]
		},
		market: {
			nodes: [
				{
					step: 'STAGE 01 // STREAM',
					title: 'Distributed API Collectors',
					tech: 'REST APIs • Python Async • Webhooks',
					desc: 'Continuous ingestion of 1,000+ daily market listings & pricing feeds.',
					inspectorTitle: 'Stage 01: High-Frequency Market API Ingestion',
					inspectorDetail:
						'Streams continuous pricing and inventory updates across 1,000+ daily listings from distributed REST APIs with automatic retry and rate-limit backoff.',
					stat1Val: '1,000+ / Day',
					stat1Lbl: 'Live Listings Streamed',
					stat2Val: 'Continuous',
					stat2Lbl: 'Real-Time Ingestion'
				},
				{
					step: 'STAGE 02 // ORCHESTRATE',
					title: 'Airflow DAG Pipeline',
					tech: 'Apache Airflow • Python • DAGs',
					desc: 'Automated scheduling, backfills, SLA monitoring & schema normalization.',
					inspectorTitle: 'Stage 02: Apache Airflow Orchestration Platform',
					inspectorDetail:
						'Orchestrated end-to-end ingestion, deduplication, and enrichment workflows using Apache Airflow DAGs with automated SLA alerting and idempotent task retries.',
					stat1Val: 'Automated DAGs',
					stat1Lbl: 'Zero-Touch Orchestration',
					stat2Val: '99.9% Uptime',
					stat2Lbl: 'Pipeline Reliability'
				},
				{
					step: 'STAGE 03 // CACHE',
					title: 'Low-Latency Redis Layer',
					tech: 'Redis • Indexed Keys • TTL Policies',
					desc: 'In-memory caching & indexed query patterns for hot market intelligence.',
					inspectorTitle: 'Stage 03: Redis In-Memory Acceleration Layer',
					inspectorDetail:
						'Integrated a Redis caching layer paired with indexed querying patterns to absorb sudden read bursts and serve hot market intelligence in milliseconds.',
					stat1Val: '300% Spike',
					stat1Lbl: 'Concurrent Traffic Sustained',
					stat2Val: '< 1 Second',
					stat2Lbl: 'P99 Response Latency'
				},
				{
					step: 'STAGE 04 // SERVE',
					title: 'Real-Time Analytics API',
					tech: 'FastAPI • Streamlit • SQL',
					desc: 'Sub-second query endpoints powering live market comparison dashboards.',
					inspectorTitle: 'Stage 04: Sub-Second Intelligence Delivery',
					inspectorDetail:
						'Delivers real-time pricing intelligence and trend analytics to downstream consumers with sub-second response times even during 3x traffic surges.',
					stat1Val: 'Sub-Second',
					stat1Lbl: 'End-User Query Time',
					stat2Val: 'Real-Time',
					stat2Lbl: 'Market Visibility'
				}
			]
		}
	};

	let currentArch = 'deloitte';
	let currentStageIdx = 0;

	const pipelineFlowEl = document.getElementById('pipeline-flow');
	const inspectorTitleEl = document.getElementById('inspector-title');
	const inspectorDetailEl = document.getElementById('inspector-detail');
	const stat1ValEl = document.getElementById('inspector-stat1-val');
	const stat1LblEl = document.getElementById('inspector-stat1-lbl');
	const stat2ValEl = document.getElementById('inspector-stat2-val');
	const stat2LblEl = document.getElementById('inspector-stat2-lbl');

	function renderArchitecture() {
		if (!pipelineFlowEl) return;
		const data = archData[currentArch];
		pipelineFlowEl.innerHTML = data.nodes
			.map(
				(n, idx) => `
			<div class="pipeline-node ${idx === currentStageIdx ? 'active' : ''}" data-idx="${idx}">
				<div class="node-step">
					<span class="node-step-num">${n.step}</span>
					<span class="node-pulse"></span>
				</div>
				<div class="node-title">${n.title}</div>
				<div class="node-tech">${n.tech}</div>
				<div class="node-desc">${n.desc}</div>
			</div>
		`
			)
			.join('');

		const activeNode = data.nodes[currentStageIdx];
		if (inspectorTitleEl) inspectorTitleEl.innerHTML = `<i class="fas fa-microchip" style="color:var(--accent-cyan)"></i> ${activeNode.inspectorTitle}`;
		if (inspectorDetailEl) inspectorDetailEl.textContent = activeNode.inspectorDetail;
		if (stat1ValEl) stat1ValEl.textContent = activeNode.stat1Val;
		if (stat1LblEl) stat1LblEl.textContent = activeNode.stat1Lbl;
		if (stat2ValEl) stat2ValEl.textContent = activeNode.stat2Val;
		if (stat2LblEl) stat2LblEl.textContent = activeNode.stat2Lbl;

		pipelineFlowEl.querySelectorAll('.pipeline-node').forEach((nodeEl) => {
			nodeEl.addEventListener('click', () => {
				currentStageIdx = parseInt(nodeEl.getAttribute('data-idx'), 10);
				renderArchitecture();
			});
		});
	}

	document.querySelectorAll('.arch-tab').forEach((tab) => {
		tab.addEventListener('click', () => {
			document.querySelectorAll('.arch-tab').forEach((t) => t.classList.remove('active'));
			tab.classList.add('active');
			currentArch = tab.getAttribute('data-arch');
			currentStageIdx = 0;
			renderArchitecture();
		});
	});

	renderArchitecture();

	/* ----------------------------------------------------------------------
	   7. PROJECTS FILTERING
	   ---------------------------------------------------------------------- */
	const filterBtns = document.querySelectorAll('.filter-btn');
	const projectCards = document.querySelectorAll('.project-card');

	filterBtns.forEach((btn) => {
		btn.addEventListener('click', () => {
			filterBtns.forEach((b) => b.classList.remove('active'));
			btn.classList.add('active');
			const cat = btn.getAttribute('data-filter');

			projectCards.forEach((card) => {
				const categories = card.getAttribute('data-category') || '';
				if (cat === 'all' || categories.includes(cat)) {
					card.style.display = 'flex';
				} else {
					card.style.display = 'none';
				}
			});
		});
	});

	/* ----------------------------------------------------------------------
	   8. INTERACTIVE SKILLS MATRIX & ECOSYSTEM
	   ---------------------------------------------------------------------- */
	const skillsCatalog = {
		'data-cloud': [
			{ name: 'Databricks & PySpark', role: 'Deloitte • Audit Lakehouse', pct: 96 },
			{ name: 'Snowflake & dbt', role: 'Deloitte • 150+ Teams Lakehouse', pct: 95 },
			{ name: 'AWS (S3, Redshift, EC2)', role: 'AWS Certified Solutions Architect', pct: 94 },
			{ name: 'Apache Airflow & Kafka', role: 'Real-Time Market Engine', pct: 90 },
			{ name: 'Delta Lake & Star/Snowflake Schema', role: '5TB+ Daily Pipelines', pct: 95 }
		],
		'lang-storage': [
			{ name: 'Python', role: 'Deloitte • Prorigo • Toshiba', pct: 98 },
			{ name: 'SQL (Analytical & Distributed)', role: 'Snowflake • DuckDB • Redshift', pct: 96 },
			{ name: 'DuckDB', role: '5M+ Row Local Audit Lake', pct: 92 },
			{ name: 'Redis', role: '300% Traffic Spike Cache Layer', pct: 88 },
			{ name: 'FastAPI & Streamlit', role: 'Microservices & Data Apps', pct: 90 }
		],
		'devops-infra': [
			{ name: 'Docker & Containerization', role: 'Toshiba NLP • Audit Microservices', pct: 92 },
			{ name: 'CI/CD (GitHub Actions)', role: 'Automated Pipeline Deployments', pct: 90 },
			{ name: 'Terraform (IaC)', role: 'Cloud Infrastructure Automation', pct: 86 },
			{ name: 'Microservices Architecture', role: 'Distributed Anomaly Detection', pct: 90 }
		],
		'enterprise-bi': [
			{ name: 'Power BI Semantic Models', role: 'Deloitte • Reclaimed 20+ hrs/wk', pct: 94 },
			{ name: 'SAP & Oracle ERP Integration', role: 'Deloitte Enterprise ELT', pct: 90 },
			{ name: 'Tableau', role: 'Executive Analytics & BI', pct: 88 },
			{ name: 'Automated Data Quality Frameworks', role: '99.9% Pipeline Accuracy SLA', pct: 95 }
		]
	};

	const skillBarsContainer = document.getElementById('skill-bars-container');
	const domainCards = document.querySelectorAll('.domain-card');
	const cloudChips = document.querySelectorAll('.cloud-chip');

	function renderSkillDomain(domainKey) {
		if (!skillBarsContainer) return;
		const items = skillsCatalog[domainKey] || skillsCatalog['data-cloud'];
		skillBarsContainer.innerHTML = items
			.map(
				(item) => `
			<div class="skill-bar-item">
				<div class="skill-bar-top">
					<span class="skill-name">${item.name}</span>
					<span class="skill-tag-role">${item.role}</span>
				</div>
				<div class="skill-track">
					<div class="skill-fill" style="width: ${item.pct}%"></div>
				</div>
			</div>
		`
			)
			.join('');

		cloudChips.forEach((chip) => {
			chip.classList.toggle('highlighted', chip.getAttribute('data-domain') === domainKey);
		});
	}

	domainCards.forEach((card) => {
		card.addEventListener('click', () => {
			domainCards.forEach((c) => c.classList.remove('active'));
			card.classList.add('active');
			renderSkillDomain(card.getAttribute('data-domain'));
		});
	});

	renderSkillDomain('data-cloud');

	/* ----------------------------------------------------------------------
	   9. INTERACTIVE LAKEHOUSE SQL / CLI TERMINAL
	   ---------------------------------------------------------------------- */
	const terminalBody = document.getElementById('terminal-body');
	const terminalInput = document.getElementById('terminal-input');

	function executeTerminalCommand(rawCmd) {
		if (!terminalBody) return;
		const cmd = rawCmd.trim();
		if (!cmd) return;
		const lower = cmd.toLowerCase();

		if (lower === 'clear') {
			terminalBody.innerHTML = '';
			return;
		}

		let outputHtml = '';
		const execTime = (Math.random() * 0.018 + 0.004).toFixed(3);

		if (lower.includes('select') && lower.includes('experience')) {
			outputHtml = `
				<table class="sql-table">
					<thead>
						<tr><th>COMPANY</th><th>ROLE</th><th>PERIOD</th><th>KEY_IMPACT</th></tr>
					</thead>
					<tbody>
						<tr><td>Deloitte</td><td>Data Associate Engineer</td><td>Sept 2025 – Present</td><td>5TB+/day ELT, -65% latency, $45k+ saved, 99.9% accuracy</td></tr>
						<tr><td>Prorigo Software</td><td>Python Developer (Intern)</td><td>Jan 2025 – June 2025</td><td>98% OCR accuracy, 500+ manual hrs/mo eliminated</td></tr>
						<tr><td>Toshiba Mitsubishi-EIC</td><td>AI Developer (Intern)</td><td>Aug 2023 – Oct 2023</td><td>Docker + LangChain NLP engine, -83% ticket turnaround</td></tr>
					</tbody>
				</table>
				<div class="cmd-meta">✓ 3 rows returned in ${execTime}s (Snowflake Warehouse: COMPUTE_WH_XL)</div>
			`;
		} else if (lower.includes('select') && (lower.includes('project') || lower.includes('metrics'))) {
			outputHtml = `
				<table class="sql-table">
					<thead>
						<tr><th>PROJECT_NAME</th><th>STACK</th><th>BENCHMARK_METRIC</th></tr>
					</thead>
					<tbody>
						<tr><td>Enterprise Audit Data Lake</td><td>Python, DuckDB, Databricks, AWS S3, Docker</td><td>5M+ rows parsed locally, -60% query latency, $0 ingress</td></tr>
						<tr><td>Real-Time Market Intelligence</td><td>Python, Apache Airflow, REST APIs, Redis</td><td>1,000+ daily listings, 300% traffic spike, sub-second</td></tr>
						<tr><td>Web 3.0 vs 2.0 vs 1.0 Research</td><td>Inderscience Publication</td><td>Peer-reviewed architectural & evolution analysis</td></tr>
					</tbody>
				</table>
				<div class="cmd-meta">✓ 3 rows returned in ${execTime}s (DuckDB Vectorized Engine v1.1)</div>
			`;
		} else if (lower.includes('aws') || lower.includes('cert')) {
			outputHtml = `
				<div>{</div>
				<div style="padding-left:16px">"Holder": "Suvin Singh",</div>
				<div style="padding-left:16px">"Certification": "AWS Certified Solutions Architect – Associate",</div>
				<div style="padding-left:16px">"Issued": "December 2025",</div>
				<div style="padding-left:16px">"CoreServices": ["S3", "Redshift", "EC2", "VPC", "IAM", "Lakehouse Architecture"],</div>
				<div style="padding-left:16px">"Status": "ACTIVE_VERIFIED"</div>
				<div>}</div>
				<div class="cmd-meta">✓ AWS STS & Certification Registry verified in ${execTime}s</div>
			`;
		} else if (lower.includes('skill') || lower.includes('dbt')) {
			outputHtml = `
				<div><strong style="color:var(--accent-cyan)">[DATA_ENG_CLOUD]</strong> Databricks, PySpark, AWS (S3, Redshift, EC2), Snowflake, dbt, Apache Airflow, Apache Kafka, Delta Lake, Star/Snowflake Schema</div>
				<div><strong style="color:var(--accent-cyan)">[LANG_STORAGE]</strong>   Python, SQL, DuckDB, Redis, FastAPI, Streamlit</div>
				<div><strong style="color:var(--accent-cyan)">[DEVOPS_INFRA]</strong>   Docker, Terraform, CI/CD (GitHub Actions), Microservices Architecture</div>
				<div><strong style="color:var(--accent-cyan)">[ENTERPRISE_BI]</strong>  SAP, Oracle ERP, Power BI, Tableau, Automated Data Quality Frameworks</div>
				<div class="cmd-meta">✓ 24 production skills indexed in ${execTime}s</div>
			`;
		} else if (lower.includes('contact') || lower.includes('email')) {
			outputHtml = `
				<div>• Email:    <a href="mailto:suvinsingh.work@gmail.com" style="color:var(--accent-cyan)">suvinsingh.work@gmail.com</a></div>
				<div>• Phone:    +91-8830545823</div>
				<div>• LinkedIn: <a href="https://linkedin.com/in/suvin-singh" target="_blank" style="color:var(--accent-cyan)">linkedin.com/in/suvin-singh</a></div>
				<div>• GitHub:   <a href="https://github.com/prosuvinhere" target="_blank" style="color:var(--accent-cyan)">github.com/prosuvinhere</a></div>
			`;
		} else if (lower.includes('education') || lower.includes('vit')) {
			outputHtml = `
				<div><strong>Vellore Institute of Technology (VIT), Vellore</strong> (July 2021 – July 2025)</div>
				<div>B.Tech in Computer Science and Engineering | <strong>CGPA: 8.68 / 10.0</strong></div>
				<div>Leadership: Manager (Sports, Finance & Stalls) – Riviera '23</div>
			`;
		} else if (lower === 'resume') {
			window.open('resume.pdf', '_blank');
			outputHtml = `<div class="cmd-meta">✓ Opening Suvin_Singh_Resume.pdf in a new tab...</div>`;
		} else {
			outputHtml = `
				<div>Available Lakehouse SQL & CLI commands:</div>
				<div>• <span style="color:var(--accent-cyan)">SELECT * FROM experience;</span> — View Deloitte, Prorigo & Toshiba work history</div>
				<div>• <span style="color:var(--accent-cyan)">SELECT * FROM projects;</span>   — View key engineering projects & benchmarks</div>
				<div>• <span style="color:var(--accent-cyan)">skills</span>                    — List full technical expertise stack</div>
				<div>• <span style="color:var(--accent-cyan)">aws --certifications</span>      — Verify AWS Solutions Architect credentials</div>
				<div>• <span style="color:var(--accent-cyan)">education</span>                 — View VIT Vellore B.Tech CSE details</div>
				<div>• <span style="color:var(--accent-cyan)">contact</span>                   — Display direct contact endpoints</div>
				<div>• <span style="color:var(--accent-cyan)">resume</span>                    — Open full PDF resume</div>
				<div>• <span style="color:var(--accent-cyan)">clear</span>                     — Clear terminal output</div>
			`;
		}

		const block = document.createElement('div');
		block.className = 'terminal-output-block';
		block.innerHTML = `<div class="cmd-echo">suvin@lakehouse:~$ ${cmd.replace(/</g, '&lt;')}</div>${outputHtml}`;
		terminalBody.appendChild(block);
		terminalBody.scrollTop = terminalBody.scrollHeight;
	}

	if (terminalInput) {
		terminalInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				executeTerminalCommand(terminalInput.value);
				terminalInput.value = '';
			}
		});
	}

	document.querySelectorAll('.preset-query-btn').forEach((btn) => {
		btn.addEventListener('click', () => {
			const q = btn.getAttribute('data-query');
			executeTerminalCommand(q);
		});
	});

	/* ----------------------------------------------------------------------
	   10. COMMAND PALETTE (CMD+K / CTRL+K) & RESUME MODAL & TOASTS
	   ---------------------------------------------------------------------- */
	const cmdBackdrop = document.getElementById('cmd-backdrop');
	const cmdInput = document.getElementById('cmd-input');
	const cmdOpenBtn = document.getElementById('cmd-open-btn');
	const resumeBackdrop = document.getElementById('resume-backdrop');

	function showToast(msg) {
		const container = document.getElementById('toast-container');
		if (!container) return;
		const t = document.createElement('div');
		t.className = 'toast';
		t.innerHTML = `<i class="fas fa-check-circle" style="color:var(--accent-emerald)"></i> <span>${msg}</span>`;
		container.appendChild(t);
		setTimeout(() => {
			t.style.opacity = '0';
			setTimeout(() => t.remove(), 250);
		}, 2800);
	}

	window.copyText = function (text, label) {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(text).then(() => {
				showToast(`${label} copied to clipboard!`);
			});
		}
	};

	window.openResumeModal = function () {
		if (resumeBackdrop) resumeBackdrop.classList.add('open');
	};

	window.closeResumeModal = function () {
		if (resumeBackdrop) resumeBackdrop.classList.remove('open');
	};

	function toggleCmdPalette(open) {
		if (!cmdBackdrop) return;
		const shouldOpen = typeof open === 'boolean' ? open : !cmdBackdrop.classList.contains('open');
		cmdBackdrop.classList.toggle('open', shouldOpen);
		if (shouldOpen && cmdInput) {
			cmdInput.value = '';
			filterCmdItems('');
			setTimeout(() => cmdInput.focus(), 50);
		}
	}

	if (cmdOpenBtn) {
		cmdOpenBtn.addEventListener('click', () => toggleCmdPalette(true));
	}

	window.addEventListener('keydown', (e) => {
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			toggleCmdPalette();
		} else if (e.key === 'Escape') {
			toggleCmdPalette(false);
			window.closeResumeModal();
		}
	});

	if (cmdBackdrop) {
		cmdBackdrop.addEventListener('click', (e) => {
			if (e.target === cmdBackdrop) toggleCmdPalette(false);
		});
	}

	if (resumeBackdrop) {
		resumeBackdrop.addEventListener('click', (e) => {
			if (e.target === resumeBackdrop) window.closeResumeModal();
		});
	}

	function filterCmdItems(q) {
		const query = q.toLowerCase();
		document.querySelectorAll('.cmd-item').forEach((item) => {
			const text = item.textContent.toLowerCase();
			item.style.display = text.includes(query) ? 'flex' : 'none';
		});
	}

	if (cmdInput) {
		cmdInput.addEventListener('input', () => filterCmdItems(cmdInput.value));
	}

	document.querySelectorAll('.cmd-item').forEach((item) => {
		item.addEventListener('click', () => {
			const action = item.getAttribute('data-action');
			const target = item.getAttribute('data-target');
			toggleCmdPalette(false);

			if (action === 'scroll' && target) {
				const el = document.querySelector(target);
				if (el) el.scrollIntoView({ behavior: 'smooth' });
			} else if (action === 'resume') {
				window.openResumeModal();
			} else if (action === 'copy-email') {
				window.copyText('suvinsingh.work@gmail.com', 'Email address');
			} else if (action === 'copy-phone') {
				window.copyText('+91-8830545823', 'Phone number');
			} else if (action === 'external' && target) {
				window.open(target, '_blank');
			}
		});
	});

	/* ----------------------------------------------------------------------
	   11. AJAX CONTACT FORM SUBMISSION (WEB3FORMS)
	   ---------------------------------------------------------------------- */
	const contactForm = document.getElementById('portfolio-contact-form');
	if (contactForm) {
		contactForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			const submitBtn = contactForm.querySelector('button[type="submit"]');
			const origHtml = submitBtn ? submitBtn.innerHTML : '';
			if (submitBtn) {
				submitBtn.disabled = true;
				submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;
			}
			try {
				const formData = new FormData(contactForm);
				const res = await fetch('https://api.web3forms.com/submit', {
					method: 'POST',
					body: formData
				});
				if (res.ok) {
					showToast('Message sent! Suvin will get back to you soon.');
					contactForm.reset();
				} else {
					showToast('Could not submit form. Please email suvinsingh.work@gmail.com directly.');
				}
			} catch (err) {
				showToast('Network error. Opening direct email client...');
			} finally {
				if (submitBtn) {
					submitBtn.disabled = false;
					submitBtn.innerHTML = origHtml;
				}
			}
		});
	}
})();
