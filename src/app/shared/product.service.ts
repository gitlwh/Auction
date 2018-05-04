import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class ProductService {

  searchEvent: EventEmitter<ProductSearchParams> = new EventEmitter();

  constructor(private http: HttpClient) { }

  getAllCategories(): string[] {
    return ['electronic', 'hardware', 'book'];
  }

  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }

  public getProduct(id: number): Observable<Product> {
    return this.http.get<Product>('/api/products/' + id);
  }

  public getCommentsForProductId(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>('/api/products/' + id + '/comments');
  }

  public search(params: ProductSearchParams): Observable<Product[]> {
    console.log(this.encodeParams(params));
    return this.http.get<Product[]>('/api/products', {params: this.encodeParams(params)});
  }

  private encodeParams(params: ProductSearchParams) {
    let httpParams = new HttpParams();
    Object.keys(params)
      .filter(key => params[key])
      .forEach(function (key) {
        httpParams = httpParams.append(key, params[key]);
      });
    return httpParams;
  }
}

export class ProductSearchParams {
  constructor(public title: string,
              public price: number,
              public category: string
  ) {}
}

export class Product {
  constructor(
    public id: number,
    public title: string,
    public price: number,
    public rating: number,
    public desc: string,
    public categories: Array<string>
  ) {

  }
}

export class Comment {
  constructor(public id: number,
              public productId: number,
              public timestamp: string,
              public user: string,
              public rating: number,
              public content: string) {

  }
}


