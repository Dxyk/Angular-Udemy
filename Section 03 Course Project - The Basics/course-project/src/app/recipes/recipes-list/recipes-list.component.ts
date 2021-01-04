import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css'],
})
export class RecipesListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe(
      'Test Recipe',
      'A test recipe',
      'https://www.acouplecooks.com/wp-content/uploads/2019/11/Recipes-Header-1.jpg'
    ),
  ];

  constructor() {}

  ngOnInit(): void {}
}
