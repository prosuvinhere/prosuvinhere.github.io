/* ==========================================================================
   SUVIN SINGH — MINIMALIST PORTFOLIO INTERACTIONS
   ========================================================================== */

(function () {
	'use strict';

	/* 1. Theme Toggle (Dark / Light) */
	const themeBtn = document.getElementById('theme-toggle');
	const savedTheme = localStorage.getItem('suvin-theme') || 'dark';
	if (savedTheme === 'light') {
		document.documentElement.setAttribute('data-theme', 'light');
	}

	function updateThemeIcon() {
		if (!themeBtn) return;
		const isLight = document.documentElement.getAttribute('data-theme') === 'light';
		themeBtn.textContent = isLight ? '☾' : '☀';
		themeBtn.setAttribute('title', isLight ? 'Switch to dark theme (T)' : 'Switch to light theme (T)');
	}
	updateThemeIcon();

	function toggleTheme() {
		const isLight = document.documentElement.getAttribute('data-theme') === 'light';
		const next = isLight ? 'dark' : 'light';
		if (next === 'light') {
			document.documentElement.setAttribute('data-theme', 'light');
		} else {
			document.documentElement.removeAttribute('data-theme');
		}
		localStorage.setItem('suvin-theme', next);
		updateThemeIcon();
	}

	if (themeBtn) {
		themeBtn.addEventListener('click', toggleTheme);
	}

	window.addEventListener('keydown', (e) => {
		const tag = (e.target && e.target.tagName) || '';
		if (tag === 'INPUT' || tag === 'TEXTAREA') return;
		if (e.key.toLowerCase() === 't' && !e.metaKey && !e.ctrlKey) {
			toggleTheme();
		}
	});

	/* 2. Inline Copy Email Helper */
	const copyEmailBtn = document.getElementById('copy-email-btn');
	if (copyEmailBtn) {
		const defaultLabel = copyEmailBtn.innerHTML;
		copyEmailBtn.addEventListener('click', () => {
			if (navigator.clipboard) {
				navigator.clipboard.writeText('suvinsingh.work@gmail.com').then(() => {
					copyEmailBtn.textContent = 'Copied email ✓';
					setTimeout(() => {
						copyEmailBtn.innerHTML = defaultLabel;
					}, 1800);
				});
			}
		});
	}

	/* 3. Interactive Architecture Schematic */
	const schematics = {
		lakehouse: [
			{
				step: '01 · INGEST',
				name: 'ERP Sources',
				tech: 'SAP · Oracle · AWS S3',
				detail: 'Extracts 5TB+ of daily financial and operational records from SAP and Oracle ERP systems into AWS S3 landing zones.',
				metric: '5TB+ / day'
			},
			{
				step: '02 · COMPUTE',
				name: 'Lakehouse Engine',
				tech: 'Databricks · PySpark',
				detail: 'Migrated legacy on-premise workloads to AWS and tuned Spark cluster compute policies, cutting pipeline latency by 65%.',
				metric: '-65% latency · $45k+/yr saved'
			},
			{
				step: '03 · MODEL',
				name: 'Dimensional ELT',
				tech: 'dbt · Snowflake',
				detail: 'Fault-tolerant dimensional transformations with automated data validation checks across 150+ cross-functional teams.',
				metric: '99.9% accuracy'
			},
			{
				step: '04 · SERVE',
				name: 'Semantic BI',
				tech: 'Power BI · Marts',
				detail: 'Optimized Power BI semantic models backed by dimensional data marts, eliminating manual analyst reporting.',
				metric: '20+ hrs/wk reclaimed'
			}
		],
		audit: [
			{
				step: '01 · STORAGE',
				name: 'Financial Ledger',
				tech: 'AWS S3 · Parquet',
				detail: 'Stores 5M+ rows of confidential financial transactions in isolated columnar partitions with zero public cloud egress.',
				metric: '5M+ rows'
			},
			{
				step: '02 · OLAP',
				name: 'In-Process SQL',
				tech: 'DuckDB · Python',
				detail: 'Executes vectorized analytical SQL directly on local columnar files, eliminating cloud data ingress overhead.',
				metric: '-60% query latency'
			},
			{
				step: '03 · INFERENCE',
				name: 'Semantic Audit',
				tech: 'Local LLMs',
				detail: 'Parses unstructured transaction descriptions locally using privacy-preserving LLMs for automated anomaly detection.',
				metric: '$0 cloud ingress'
			},
			{
				step: '04 · RUNTIME',
				name: 'Microservices',
				tech: 'Docker · FastAPI',
				detail: 'Containerized anomaly-scoring microservices for reproducible deployment across isolated audit environments.',
				metric: '100% isolated'
			}
		],
		market: [
			{
				step: '01 · COLLECT',
				name: 'API Streams',
				tech: 'REST APIs · Python',
				detail: 'Streams continuous market pricing and listing updates across 1,000+ daily feeds with automated backoff.',
				metric: '1,000+ daily listings'
			},
			{
				step: '02 · ORCHESTRATE',
				name: 'Workflow DAGs',
				tech: 'Apache Airflow',
				detail: 'Orchestrates automated ingestion, deduplication, and schema normalization pipelines on scheduled Airflow DAGs.',
				metric: 'Automated DAGs'
			},
			{
				step: '03 · CACHE',
				name: 'Hot Index Layer',
				tech: 'Redis · Indexing',
				detail: 'Pairs Redis in-memory caching with indexed query patterns to absorb 300% concurrent traffic spikes.',
				metric: '300% spike sustained'
			},
			{
				step: '04 · QUERY',
				name: 'Low-Latency API',
				tech: 'Sub-Second Serve',
				detail: 'Delivers sub-second response times for downstream market intelligence queries.',
				metric: '< 1s response'
			}
		]
	};

	let activeArch = 'lakehouse';
	let activeNodeIdx = 0;

	const nodesWrap = document.getElementById('schematic-nodes');
	const detailText = document.getElementById('schematic-detail-text');
	const detailMetric = document.getElementById('schematic-detail-metric');

	function renderSchematic() {
		if (!nodesWrap) return;
		const items = schematics[activeArch];
		nodesWrap.innerHTML = items
			.map(
				(n, i) => `
			<div class="s-node ${i === activeNodeIdx ? 'active' : ''}" data-idx="${i}">
				<span class="s-node-step">${n.step}</span>
				<span class="s-node-name">${n.name}</span>
				<span class="s-node-tech">${n.tech}</span>
			</div>
		`
			)
			.join('');

		const cur = items[activeNodeIdx];
		if (detailText) detailText.textContent = cur.detail;
		if (detailMetric) detailMetric.textContent = cur.metric;

		nodesWrap.querySelectorAll('.s-node').forEach((el) => {
			el.addEventListener('click', () => {
				activeNodeIdx = parseInt(el.getAttribute('data-idx'), 10);
				renderSchematic();
			});
		});
	}

	document.querySelectorAll('.arch-btn').forEach((btn) => {
		btn.addEventListener('click', () => {
			document.querySelectorAll('.arch-btn').forEach((b) => b.classList.remove('active'));
			btn.classList.add('active');
			activeArch = btn.getAttribute('data-arch');
			activeNodeIdx = 0;
			renderSchematic();
		});
	});

	renderSchematic();

	/* 4. Contact Form AJAX */
	const form = document.getElementById('contact-form');
	const formStatus = document.getElementById('form-status');
	if (form) {
		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			const btn = form.querySelector('button[type="submit"]');
			if (btn) btn.textContent = 'Sending...';
			try {
				const res = await fetch('https://api.web3forms.com/submit', {
					method: 'POST',
					body: new FormData(form)
				});
				if (res.ok) {
					if (formStatus) formStatus.textContent = 'Message sent. Thank you.';
					form.reset();
				} else {
					if (formStatus) formStatus.textContent = 'Error sending. Please email suvinsingh.work@gmail.com.';
				}
			} catch (_) {
				if (formStatus) formStatus.textContent = 'Network error. Please email suvinsingh.work@gmail.com.';
			} finally {
				if (btn) btn.textContent = 'Send message';
			}
		});
	}
})();
