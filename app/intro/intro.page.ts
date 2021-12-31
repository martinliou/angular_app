import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  slideOpts = {

  };
  constructor(private router: Router) { }

  ngOnInit() {
  }

  jumpToNextPage() {
    localStorage.setItem('first_init', '1');
    this.router.navigate(['/']);
  }
}
