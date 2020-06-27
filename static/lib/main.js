/* globals document, $, window, socket, ajaxify, bootbox */

$(document).ready(() => {
  $(window).on('action:ajaxify.end', (_, { tpl_url: tplUrl }) => {
    if (tplUrl === 'category') {
      const { cid } = ajaxify.data;

      // insert head dom
      const container = $('<div id="category-header"></div>');
      $('[data-widget-area="header"]').append(container);
      const setContent = (html) => { container.html(html); };

      const load = async () => {
        const content = await socket.emit('plugins.categoryheader.getRendered', { cid });
        setContent(content);
      };

      load();

      // edit btn
      if (ajaxify.data.privileges.editable) {
        const btn = $('<button class="btn btn-default" type="button">编辑版头</button>')
          .click(async () => {
            const value = await socket.emit('plugins.categoryheader.getRaw', { cid });
            bootbox.prompt({
              title: '编辑版头(Markdown With Inline HTML)',
              inputType: 'textarea',
              value,
              async callback(htmltext) {
                if (htmltext !== null) {
                  await socket.emit('plugins.categoryheader.edit', { cid, content: htmltext });
                  load();
                }
              },
            });
          });

        $('[component="category/controls"]').prepend(btn);
      }
    }
  });
});
