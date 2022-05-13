import Backbone from "backbone";
import Model from "./Model";
import Module, { IBaseModule } from "./Module";

export default class View<
  TModel extends Model = Model,
  TElement extends Element = HTMLElement
> extends Backbone.View<TModel, TElement> {
  protected get pfx() {
    return this.em.config.stylePrefix || "";
  }

  protected get ppfx() {
    return this.pfx + this.config.stylePrefix || "";
  }

  protected get module(): TModel extends Model<infer M>? M: unknown {
    return this.model?.module ?? (this.collection as any).module;
  }

  protected get em() {
    return this.module.em;
  }

  protected get config():  TModel extends Model<infer M> ? (M extends IBaseModule<infer C> ? C : unknown) : unknown{
    return this.module.config as any
  }
}
