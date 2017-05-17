import { Component, OnInit } from '@angular/core';
import { Title }     from '@angular/platform-browser';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  usuario: any = {}

  constructor(private title: Title) { }

  ngOnInit() {
    this.title.setTitle("Dashboard");
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
  }

}
