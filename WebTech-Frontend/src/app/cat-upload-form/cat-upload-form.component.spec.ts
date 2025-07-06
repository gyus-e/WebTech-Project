import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatUploadFormComponent } from './cat-upload-form.component';

describe('CatUploadFormComponent', () => {
  let component: CatUploadFormComponent;
  let fixture: ComponentFixture<CatUploadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatUploadFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatUploadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
