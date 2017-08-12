import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['../../public/css/about.css']
})
export class AboutComponent implements OnInit {

  constructor(
    private titleService: Title,
  ) { }

  ngOnInit() {
    this.setTitle("Tianzhen呀-关于");
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
