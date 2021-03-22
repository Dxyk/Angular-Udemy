import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DataService } from '../shared/data.service';
import { UserComponent } from './user.component';
import { UserService } from './user.service';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  // beforeEach(async () => {
  //   await TestBed.configureTestingModule({
  //     declarations: [ UserComponent ]
  //   })
  //   .compileComponents();
  // });
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use user name from the service', () => {
    const userService = fixture.debugElement.injector.get(UserService);
    expect(userService.user.name).toEqual(component.user.name);
  });

  it('should display user name if user is logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain(
      component.user.name
    );
  });

  it('should not display user name if user is logged in', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).not.toContain(
      component.user.name
    );
  });

  it('should not fetch data successfully if not called asynchronously', () => {
    const dataService = fixture.debugElement.injector.get(DataService);
    const spy = spyOn(dataService, 'getDetails').and.returnValue(
      Promise.resolve('Data')
    );
    fixture.detectChanges();
    expect(component.data).toBe(undefined);
  });

  it('should not fetch data successfully if not called asynchronously', async () => {
    const dataService = fixture.debugElement.injector.get(DataService);
    const spy = spyOn(dataService, 'getDetails').and.returnValue(
      Promise.resolve('Data')
    );
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.data).toBe(undefined);
    });
  });

  it('should not fetch data successfully if not called asynchronously', fakeAsync(() => {
    const dataService = fixture.debugElement.injector.get(DataService);
    const spy = spyOn(dataService, 'getDetails').and.returnValue(
      Promise.resolve('Data')
    );
    fixture.detectChanges();
    tick();
    expect(component.data).toBe(undefined);
  }));
});
