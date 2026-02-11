const ATTRIBUTES = [
 \"Ball Control\", \"Passing\", \"Shooting\", \"Speed\", \"Defense\", \"IQ\", \"Fitness\", \"Teamwork\"
 ];
 const FIELDS = [
 { name: \"Toyota Soccer Center\", city: \"Frisco\", fields: 17, surface: \"Grass/Turf\" },
 { name: \"Harold Patterson Sports Center\", city: \"Arlington\", fields: 12, surface: \"Grass\" },
 { name: \"Meyer Park\", city: \"Houston\", fields: 26, surface: \"Grass\" },
 { name: \"Five Points Community Park\", city: \"El Paso\", fields: 10, surface: \"Turf\" }
 ];
 const app = {
 state: {
 currentUser: null,
 users: {},
 games: [],
 teams: [],
 checkins: {}, // gameId -> [userIds]
 ratings: {}, // fromId_toId_gameId -> ratingData
 activeTab: 'dashboard',
 theme: 'light'
 },
 init() {
 const saved = localStorage.getItem('soccer_hub_pro_state');
 if (saved) {
 this.state = {...this.state, ...JSON.parse(saved)};
 }
 this.applyTheme();
 if (this.state.currentUser) {
 this.showMain();
 }
 this.renderSelfRatingForm();
 },
 save() {
 localStorage.setItem('soccer_hub_pro_state', JSON.stringify(this.state));
 },
 toggleAuth(toSignup) {
 document.getElementById('login-form').classList.toggle('hidden', toSignup);
 document.getElementById('signup-form').classList.toggle('hidden', !toSignup);
 },
 signup() {
 const user = document.getElementById('reg-user').value.trim();
 const name = document.getElementById('reg-name').value.trim();
 const pass = document.getElementById('reg-pass').value;
 if (!user || !name || !pass) return alert(\"Please fill all fields\");
 if (this.state.users[user]) return alert(\"Username taken\");
 this.state.users[user] = {
 username: user,
 name: name,
 password: pass,
 profile: { position: 'Midfielder', team: '', bio: '', avatar: '⚽' },
 stats: { xp: 100, level: 1, games: 0, streak: 0, totalRatings: 0, avgRating: 0 },
 selfRatings: ATTRIBUTES.reduce((acc, a) => ({...acc, [a]: 5}), {}),
 achievements: []
 };
 this.save();
 alert(\"Account created! Please login.\");
 this.toggleAuth(false);
 },
 login() {
 const user = document.getElementById('login-user').value.trim();
 const pass = document.getElementById('login-pass').value;
 if (this.state.users[user] && this.state.users[user].password === pass) {
 this.state.currentUser = user;
 this.save();
 this.showMain();
 } else {
 alert(\"Invalid credentials\");
 }
 },
 logout() {
 this.state.currentUser = null;
 this.save();
 location.reload();
 },
 showMain() {
 document.getElementById('auth-view').classList.add('hidden');
 document.getElementById('main-view').classList.remove('hidden');
 this.switchTab('dashboard');
 this.updateUI();
 },
 switchTab(tabId) {
 this.state.activeTab = tabId;
 document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
 document.getElementById('tab-' + tabId).classList.add('active');
 
 document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
 const navItems = document.querySelectorAll('.nav-item');
 if (tabId === 'dashboard') navItems[0].classList.add('active');
 if (tabId === 'calendar') navItems[1].classList.add('active');
 if (tabId === 'directory') navItems[2].classList.add('active');
 if (tabId === 'stats') navItems[3].classList.add('active');
 if (tabId === 'settings') navItems[4].classList.add('active');
 this.updateUI();
 if (tabId === 'stats') this.renderChart();
 },
 updateUI() {
 const user = this.state.users[this.state.currentUser];
 if (!user) return;
 document.getElementById('dash-name').innerText = user.name;
 document.getElementById('dash-pos').innerText = `${user.profile.position} • ${user.profile.team || 'No Team'}`;
 document.getElementById('dash-level').innerText = user.stats.level;
 
 const xpNext = user.stats.level * 200;
 const xpProg = (user.stats.xp % xpNext);
 document.getElementById('dash-xp-text').innerText = `${xpProg} / ${xpNext} XP`;
 document.getElementById('dash-xp-fill').style.width = `${(xpProg / xpNext) * 100}%`;
 document.getElementById('stat-games').innerText = user.stats.games;
 document.getElementById('stat-rating').innerText = user.stats.avgRating.toFixed(1);
 document.getElementById('stat-streak').innerText = user.stats.streak;
 document.getElementById('stat-xp').innerText = user.stats.xp;
 document.getElementById('prof-pos').value = user.profile.position;
 document.getElementById('prof-team').value = user.profile.team;
 document.getElementById('prof-bio').value = user.profile.bio;
 this.renderDirectory();
 this.renderGames();
 this.renderTeams();
 this.renderLeaderboard();
 this.renderFields();
 },
 saveProfile() {
 const user = this.state.users[this.state.currentUser];
 user.profile.position = document.getElementById('prof-pos').value;
 user.profile.team = document.getElementById('prof-team').value;
 user.profile.bio = document.getElementById('prof-bio').value;
 this.save();
 this.updateUI();
 },
 renderSelfRatingForm() {
 const container = document.getElementById('self-rating-form');
 if (!container) return;
 container.innerHTML = ATTRIBUTES.map(attr => `
 <div class=\"attr-item\">
 <label>${attr}</label>
 <input type=\"range\" min=\"1\" max=\"10\" step=\"1\" value=\"5\" id=\"self-${attr.replace(/ /g, '')}\">
 </div>
 `).join('');
 },
 saveSelfRating() {
 const user = this.state.users[this.state.currentUser];
 ATTRIBUTES.forEach(attr => {
 user.selfRatings[attr] = parseInt(document.getElementById(`self-${attr.replace(/ /g, '')}`).value);
 });
 user.stats.xp += 50;
 this.save();
 this.updateUI();
 alert(\"Self rating updated! +50 XP\");
 },
 renderDirectory() {
 const query = document.getElementById('dir-search').value.toLowerCase();
 const container = document.getElementById('player-list');
 const users = Object.values(this.state.users);
 
 container.innerHTML = users
 .filter(u => u.username !== this.state.currentUser && (u.name.toLowerCase().includes(query) || u.profile.position.toLowerCase().includes(query)))
 .map(u => `
 <div class=\"list-item\">
 <div class=\"avatar\">${u.profile.avatar}</div>
 <div class=\"item-info\">
 <div class=\"item-name\">${u.name}</div>
 <div class=\"item-sub\">${u.profile.position} • ${u.profile.team || 'Free Agent'}</div>
 <div class=\"badge\">Rating: ${u.stats.avgRating.toFixed(1)}</div>
 </div>
 <button class=\"btn btn-primary\" style=\"width: auto; padding: 8px 12px;\" onclick=\"app.openRatePlayer('${u.username}')\">Rate</button>
 </div>
 `).join('');
 },
 openRatePlayer(targetUser) {
 // Check if they played in a game together
 const myGames = this.state.games.filter(g => this.state.checkins[g.id]?.includes(this.state.currentUser));
 const playedTogether = myGames.some(g => this.state.checkins[g.id]?.includes(targetUser));
 if (!playedTogether) {
 return alert(\"You can only rate players you have checked-in with for a game!\");
 }
 const u = this.state.users[targetUser];
 this.openModal(`
 <h3 style=\"margin-top:0\">Rate ${u.name}</h3>
 <p class=\"item-sub\">Rate performance across attributes (1-10)</p>
 <div class=\"attr-grid\">
 ${ATTRIBUTES.map(attr => `
 <div class=\"attr-item\">
 <label>${attr}</label>
 <input type=\"range\" min=\"1\" max=\"10\" value=\"5\" id=\"rate-${attr.replace(/ /g, '')}\">
 </div>
 `).join('')}
 </div>
 <div class=\"input-group\" style=\"margin-top:15px\">
 <label>Comment</label>
 <textarea id=\"rate-comment\" placeholder=\"Optional feedback...\"></textarea>
 </div>
 <button class=\"btn btn-primary\" onclick=\"app.submitRating('${targetUser}')\">Submit Rating</button>
 `);
 },
 submitRating(targetUser) {
 const user = this.state.users[targetUser];
 const ratings = ATTRIBUTES.map(attr => parseInt(document.getElementById(`rate-${attr.replace(/ /g, '')}`).value));
 const avg = ratings.reduce((a,b) => a+b, 0) / ratings.length;
 user.stats.totalRatings++;
 user.stats.avgRating = ((user.stats.avgRating * (user.stats.totalRatings - 1)) + avg) / user.stats.totalRatings;
 
 this.state.users[this.state.currentUser].stats.xp += 20;
 this.save();
 this.closeModal();
 this.updateUI();
 alert(`Rating submitted! +20 XP to you.`);
 },
 renderGames() {
 const container = document.getElementById('game-list');
 container.innerHTML = this.state.games.sort((a,b) => new Date(a.date) - new Date(b.date)).map(g => {
 const isCheckedIn = this.state.checkins[g.id]?.includes(this.state.currentUser);
 return `
 <div class=\"list-item\">
 <div class=\"item-info\">
 <div class=\"item-name\">${g.opponent}</div>
 <div class=\"item-sub\">${g.date} • ${g.location}</div>
 </div>
 ${isCheckedIn ? 
 `<div class=\"badge\" style=\"background:var(--primary); color:white\">Checked In</div>` : 
 `<button class=\"btn btn-primary\" style=\"width: auto; padding: 8px 12px;\" onclick=\"app.checkIn('${g.id}')\">Check In</button>`
 }
 </div>
 `;
 }).join('') || '<p class=\"item-sub\">No games scheduled.</p>';
 },
 openAddGame() {
 this.openModal(`
 <h3>Add Game</h3>
 <div class=\"input-group\">
 <label>Opponent / Event</label>
 <input type=\"text\" id=\"g-opp\" placeholder=\"Team B\">
 </div>
 <div class=\"input-group\">
 <label>Date & Time</label>
 <input type=\"datetime-local\" id=\"g-date\">
 </div>
 <div class=\"input-group\">
 <label>Location</label>
 <input type=\"text\" id=\"g-loc\" placeholder=\"Meyer Park, Field 4\">
 </div>
 <button class=\"btn btn-primary\" onclick=\"app.addGame()\">Create Game</button>
 `);
 },
 addGame() {
 const opp = document.getElementById('g-opp').value;
 const date = document.getElementById('g-date').value;
 const loc = document.getElementById('g-loc').value;
 if (!opp || !date) return;
 const game = { id: Date.now(), opponent: opp, date, location: loc };
 this.state.games.push(game);
 this.state.checkins[game.id] = [];
 this.save();
 this.closeModal();
 this.updateUI();
 },
 checkIn(gameId) {
 if (!this.state.checkins[gameId]) this.state.checkins[gameId] = [];
 if (this.state.checkins[gameId].includes(this.state.currentUser)) return;
 
 this.state.checkins[gameId].push(this.state.currentUser);
 const user = this.state.users[this.state.currentUser];
 user.stats.games++;
 user.stats.xp += 50;
 user.stats.streak++;
 this.save();
 this.updateUI();
 alert(\"Checked in! +50 XP\");
 },
 renderTeams() {
 const container = document.getElementById('team-list');
 container.innerHTML = this.state.teams.map(t => `
 <div class=\"list-item\">
 <div class=\"avatar\">🛡️</div>
 <div class=\"item-info\">
 <div class=\"item-name\">${t.name}</div>
 <div class=\"item-sub\">${t.members.length} Members • Coach: ${t.coach}</div>
 </div>
 </div>
 `).join('') || '<p class=\"item-sub\">You haven\\\'t joined any teams.</p>';
 },
 openCreateTeam() {
 this.openModal(`
 <h3>Create Team</h3>
 <div class=\"input-group\">
 <label>Team Name</label>
 <input type=\"text\" id=\"t-name\" placeholder=\"Eagles FC\">
 </div>
 <button class=\"btn btn-primary\" onclick=\"app.createTeam()\">Create</button>
 `);
 },
 createTeam() {
 const name = document.getElementById('t-name').value;
 if (!name) return;
 this.state.teams.push({
 id: Date.now(),
 name: name,
 coach: this.state.users[this.state.currentUser].name,
 members: [this.state.currentUser]
 });
 this.state.users[this.state.currentUser].stats.xp += 100;
 this.save();
 this.closeModal();
 this.updateUI();
 },
 renderLeaderboard() {
 const container = document.getElementById('leaderboard-list');
 const top = Object.values(this.state.users)
 .sort((a,b) => b.stats.avgRating - a.stats.avgRating)
 .slice(0, 10);
 
 container.innerHTML = top.map((u, i) => `
 <div class=\"list-item\">
 <div style=\"font-weight:800; width:20px\">${i+1}</div>
 <div class=\"avatar\">${u.profile.avatar}</div>
 <div class=\"item-info\">
 <div class=\"item-name\">${u.name}</div>
 <div class=\"item-sub\">Rating: ${u.stats.avgRating.toFixed(2)}</div>
 </div>
 </div>
 `).join('');
 },
 renderFields() {
 const container = document.getElementById('fields-list');
 container.innerHTML = FIELDS.map(f => `
 <div class=\"list-item\">
 <div class=\"avatar\">📍</div>
 <div class=\"item-info\">
 <div class=\"item-name\">${f.name}</div>
 <div class=\"item-sub\">${f.city} • ${f.fields} Fields • ${f.surface}</div>
 </div>
 </div>
 `).join('');
 },
 renderChart() {
 const ctx = document.getElementById('stats-chart').getContext('2d');
 const user = this.state.users[this.state.currentUser];
 if (window.myChart) window.myChart.destroy();
 
 window.myChart = new Chart(ctx, {
 type: 'radar',
 data: {
 labels: ATTRIBUTES,
 datasets: [{
 label: 'Self Rating',
 data: ATTRIBUTES.map(a => user.selfRatings[a]),
 backgroundColor: 'rgba(32, 140, 133, 0.2)',
 borderColor: '#208C85',
 pointBackgroundColor: '#208C85'
 }]
 },
 options: {
 scales: r: { min: 0, max: 10, ticks: { stepSize: 2 } } },
 plugins: { legend: { display: false } }
 }
 });
 },
 toggleTheme() {
 this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
 this.applyTheme();
 this.save();
 },
 applyTheme() {
 document.body.className = this.state.theme;
 document.getElementById('theme-btn').innerText = this.state.theme === 'light' ? '🌙' : '☀️';
 document.getElementById('dark-toggle').innerText = this.state.theme === 'light' ? 'Off' : 'On';
 },
 openModal(html) {
 document.getElementById('modal-body').innerHTML = html;
 document.getElementById('modal-container').style.display = 'flex';
 },
 closeModal() {
 document.getElementById('modal-container').style.display = 'none';
 }
 };
 app.init();
 
 if ('serviceWorker' in navigator) {
 window.addEventListener('load', () => {
 navigator.serviceWorker.register('./sw.js')
 .then(reg => console.log('SW registered!', reg))
 .catch(err => console.log('SW reg error:', err));
 });
 }
