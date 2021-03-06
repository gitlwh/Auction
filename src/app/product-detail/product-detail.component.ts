import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Product, ProductService, Comment} from '../shared/product.service';
import {C} from '@angular/core/src/render3';
import {WebSocketService} from '../shared/web-socket.service';
import {Subscribable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product: Product;

  comments: Comment[];

  newRating = 5;
  newComment = '';

  isCommentHidden = true;

  isWatched = false;
  currentBid: number;

  subsription: Subscription;

  constructor(private routeInfo: ActivatedRoute,
              private productService: ProductService,
              private wsService: WebSocketService
  ) { }

  ngOnInit() {
    const productId: number = this.routeInfo.snapshot.params['productId'];
    this.productService.getProduct(productId).subscribe(
      product => {
        this.product = product;
        this.currentBid = product.price;
      }
    );
    this.productService.getCommentsForProductId(productId).subscribe(
      comments => this.comments = comments
    );
  }

  addComment() {
    const comment = new Comment(0, this.product.id, new Date().toISOString(), 'someone', this.newRating, this.newComment);
    this.comments.unshift(comment);

    const sum = this.comments.reduce((sum, comment) => sum + comment.rating, 0);
    this.product.rating = sum / this.comments.length;
    this.newComment = null;
    this.newRating = 5;
    this.isCommentHidden = true;
  }

  watchProduct() {
    if (this.subsription) {
      this.subsription.unsubscribe();
      this.isWatched = false;
      this.subsription = null;
    } else {
      this.isWatched = true;
      this.subsription = this.wsService.createObservableSocket('ws://localhost:8085', this.product.id).
      subscribe(
        products => {
          const product = products.find(p => p.productId === this.product.id);
          this.currentBid = product.bid;
        }
      );
    }
  }

}
