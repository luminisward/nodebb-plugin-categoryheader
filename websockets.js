const db = require.main.require('./src/database');
const posts = require.main.require('./src/posts');
const winston = require.main.require('winston');
const privileges = require.main.require('./src/privileges');

const md = require('markdown-it')({
  html: true,
  typographer: true,
});

const getObjKey = cid => `plugins:categoryheader:cid:${cid}:html`;

const methods = {
  async edit(socket, { cid, content }) {
    if (!cid > 0) {
      winston.error(`[plugins.categoryheader] illegal cid: ${cid}`);
      throw new Error(`illegal cid: ${cid}`);
    }

    const isAdminOrMod = await privileges.categories.isAdminOrMod(cid, socket.uid);
    if (isAdminOrMod) {
      const key = getObjKey(cid);
      await db.set(key, content);
      winston.info(`[plugins.categoryheader] edit() ${key} ${content}`);
    } else {
      throw new Error('[[error:no-privileges]]');
    }
  },
  async getRaw(socket, { cid }) {
    const key = getObjKey(cid);
    const result = await db.get(key);
    return result;
  },
  async getRendered(socket, { cid }) {
    const raw = await methods.getRaw(socket, { cid });
    return posts.sanitize(md.render(raw));
  },
};

module.exports = methods;
