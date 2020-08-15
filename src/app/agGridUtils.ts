import { Component, TemplateRef, Directive, ViewContainerRef, Input } from '@angular/core';
import { ICellRendererAngularComp, AgGridAngular } from 'ag-grid-angular';

/**
 * Generic cell renderer that uses Angular template.
 *
 * Can be automatically set up with `AppAgGridFrameworkComponent`.
 *
 * If used directly, template should be created by `templateFactory` specififed in `cellRendererParams` of `columnDef`.
 */
@Component({
  template: `<ng-container *ngTemplateOutlet="template; context: { data: data }"></ng-container>`,
})
export class TemplatedCellRenderer<T> implements ICellRendererAngularComp {
  data: T;
  template: TemplateRef<T>;

  agInit(params): void {
    if (params.templateFactory) {
      this.template = params.templateFactory();
    } else {
      this.template = params.frameworkComponentWrapper.appTemplates[params.colDef.cellRenderer];
    }
    this.data = params.data;
  }

  refresh(): boolean {
    return false;
  }
}

/**
 * Register template as cell renderer of AgGrid.
 */
@Directive({
  selector: '[appAgGridCellRenderer]',
})
export class AppAgGridCellRenderer {
  constructor(
    private agGrid: AgGridAngular,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  /** Set frameworkComponent id */
  @Input() set appAgGridCellRenderer(id: string) {
    this.agGrid.frameworkComponents = {
      ...this.agGrid.frameworkComponents,
      [id]: TemplatedCellRenderer,
    };
    const fcw = (this.agGrid as any).frameworkComponentWrapper;
    fcw.appTemplates = { ...fcw.appTemplates, [id]: this.templateRef };
  }
}
