import { View } from 'backbone';
import html from 'utils/html';
import PropertiesView from './PropertiesView';

export default class SectorView extends View {
  template({ pfx, label }) {
    const icons = this.em?.getConfig('icons');
    const iconCaret = icons?.caret || '';

    return html`
      <div class="${pfx}title" data-sector-title>
        <div class="${pfx}title-caret">$${iconCaret}</div>
        <div class="${pfx}title-label">${label}</div>
      </div>
    `;
  }

  events() {
    return {
      'click [data-sector-title]': 'toggle',
    };
  }

  initialize(o) {
    this.config = o.config || {};
    this.em = this.config.em;
    this.pfx = this.config.stylePrefix || '';
    this.target = o.target || {};
    this.propTarget = o.propTarget || {};
    const model = this.model;
    this.listenTo(model, 'change:open', this.updateOpen);
    this.listenTo(model, 'updateVisibility', this.updateVisibility);
    this.listenTo(model, 'destroy remove', this.remove);
  }

  /**
   * If all properties are hidden this will hide the sector
   */
  updateVisibility() {
    var show;
    this.model.get('properties').each(prop => {
      if (prop.get('visible')) {
        show = 1;
      }
    });
    this.el.style.display = show ? '' : 'none';
  }

  /**
   * Update visibility
   */
  updateOpen() {
    if (this.model.get('open')) this.show();
    else this.hide();
  }

  /**
   * Show the content of the sector
   * */
  show() {
    this.$el.addClass(this.pfx + 'open');
    this.getPropertiesEl().style.display = '';
  }

  /**
   * Hide the content of the sector
   * */
  hide() {
    this.$el.removeClass(this.pfx + 'open');
    this.getPropertiesEl().style.display = 'none';
  }

  getPropertiesEl() {
    return this.$el.find(`.${this.pfx}properties`).get(0);
  }

  /**
   * Toggle visibility
   * */
  toggle(e) {
    const { model } = this;
    const v = model.get('open') ? 0 : 1;
    model.set('open', v);
  }

  render() {
    const { pfx, model, em, $el } = this;
    const { id, name } = model.attributes;
    const label = (em && em.t(`styleManager.sectors.${id}`)) || name;
    $el.html(this.template({ pfx, label }));
    this.renderProperties();
    $el.attr('class', `${pfx}sector ${pfx}sector__${id} no-select`);
    this.updateOpen();
    return this;
  }

  renderProperties() {
    const { model, target, propTarget, config } = this;
    const objs = model.get('properties');

    if (objs) {
      const view = new PropertiesView({
        collection: objs,
        target,
        propTarget,
        config,
      });
      this.$el.append(view.render().el);
    }
  }
}
