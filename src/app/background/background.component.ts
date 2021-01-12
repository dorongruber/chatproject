import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements OnInit {

  viewstate = true;
  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.router.navigate(['/login']);
  }
  RouteTo() {

    if (this.viewstate) {
      this.viewstate = !this.viewstate;
      this.router.navigate(['/register']);
    } else {
      this.viewstate = !this.viewstate;
      this.router.navigate(['/login']);
    }
  }
}
