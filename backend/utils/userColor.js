// picks a consistent color for a username so the same person always
// gets the same avatar color across sessions
const PALETTE = [
  '#5865F2', '#EB459E', '#57F287', '#FEE75C',
  '#ED4245', '#3BA55D', '#FAA61A', '#9B59B6',
  '#1ABC9C', '#E67E22'
];

function colorForUsername(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
}

module.exports = { colorForUsername };
