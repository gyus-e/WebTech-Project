import { Component, computed, effect, inject, Signal, signal } from '@angular/core';
import { RestBackendFetchService } from '../_services/rest-backend/rest-backend-fetch.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CatResponse } from '../_types/cat-response.type';
import { RestBackendErrorHandlerService } from '../_services/rest-backend/rest-backend-error-handler.service';
import { PhotoResponse } from '../_types/photo-response.type';
import { REST_BACKEND_URL } from '../_config/rest-backend-url';
import { QuillModule } from 'ngx-quill';
import { AuthService } from '../_services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RestBackendUploadService } from '../_services/rest-backend/rest-backend-upload.service';
import { RestBackendDeleteService } from '../_services/rest-backend/rest-backend-delete.service';
import { RestBackendUpdateService } from '../_services/rest-backend/rest-backend-update.service';

@Component({
  selector: 'app-cat-details',
  imports: [QuillModule, ReactiveFormsModule],
  templateUrl: './cat-details.component.html',
  styleUrl: './cat-details.component.scss'
})
export class CatDetailsComponent {
  router = inject(Router);
  toastr = inject(ToastrService);
  authService = inject(AuthService);
  fetchService = inject(RestBackendFetchService);
  uploadService = inject(RestBackendUploadService);
  updateService = inject(RestBackendUpdateService);
  deleteService = inject(RestBackendDeleteService);
  errHandler = inject(RestBackendErrorHandlerService);

  photosUrls = new Map<number, string>();
  commentsMap = new Map<number, any[]>(); // photoId -> comments array
  photos = signal<PhotoResponse[] | null>(null);
  cat_id = signal<number | undefined>(undefined);
  showCommentEditor = signal<number>(-1);
  showPhotoEditor = signal<number>(-1);
  cat = computed(() => this.catSignal());

  editPhotoForm = new FormGroup({
    description: new FormControl('', [Validators.required]),
  });

  private readonly catSignal = signal<CatResponse | undefined>(undefined);

  commentForm = new FormGroup({
    comment: new FormControl('', [Validators.required]),
  });

  editCommentForm = new FormGroup({
    comment: new FormControl('', [Validators.required]),
  });


  constructor(route: ActivatedRoute) {

    effect(() => {
      const catId = this.cat_id();
      if (!catId) {
        this.toastr.error('Cat ID is not set.');
        return;
      }
      this.fetchService.getCatById(catId).subscribe({
        next: (cat) => {
          if (!cat) {
            this.toastr.error('Cat not found.');
            this.router.navigateByUrl("/cats");
          } else {
            this.catSignal.set(cat);
            this.getAllPhotos(cat.id);
          }
        },
        error: (err) => {
          this.errHandler.handleError(err);
          this.router.navigateByUrl("/cats");
        }
      });
    });

    effect(() => {
      const photos = this.photos();
      const cat = this.cat();
      if (!photos || !cat) {
        return;
      }

      this.setPhotosUrls(cat.id, photos);
    });


    route.paramMap.subscribe(params => {
      const cat_id_param = params.get('cat_id')
      if (!cat_id_param) {
        this.toastr.error('No cat id provided in the route parameters.');
        this.router.navigateByUrl("/cats");
      };

      this.cat_id.set(Number(cat_id_param));
    });

  }


  getCommentsForPhoto(photoId: number): any[] {
    return this.commentsMap.get(photoId) || [];
  }


  getAllPhotos(cat: number) {
    this.fetchService.getCatPhotos(cat).subscribe({
      next: (photos) => {
        this.photos.set(photos);
        photos.forEach(photo => {
          this.getComments(photo.id);
        });
      },
      error: (err) => {
        this.errHandler.handleError(err);
      }
    });
  }


  setPhotosUrls(cat_id: number, photos: PhotoResponse[]) {
    if (!photos || photos.length === 0) {
      return;
    }

    for (const photo of photos) {
      this.photosUrls.set(photo.id, `${REST_BACKEND_URL}/cats/${cat_id}/photos/${photo.id}/send`);
    }
  }


  createQuillElement(text: string | undefined | null): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = text ?? '';
    return txt.value;
  }


  getComments(photoId: number) {
    this.fetchService.getComments(this.cat_id()!, photoId).subscribe({
      next: (comments) => {
        this.commentsMap.set(photoId, comments);
      },
      error: (err) => {
        this.errHandler.handleError(err);
      }
    });
  }


  postComment(photoId: number) {
    if (!this.authService.isAuthenticated()) {
      this.toastr.error('You must be logged in to post a comment.');
      return;
    }

    if (this.commentForm.invalid) {
      this.toastr.error('Comment cannot be empty.');
      return;
    }
    ;
    if (!photoId || isNaN(photoId)) {
      this.toastr.error('Photo ID is not set or invalid.');
      return;
    }

    const comment = this.commentForm.value.comment;
    if (!comment) {
      this.toastr.error('Comment cannot be empty.');
      return;
    }

    const catId = this.cat_id();
    if (!catId) {
      this.toastr.error('Cat ID is not set.');
      return;
    }

    this.uploadService.postComment(catId, photoId, comment).subscribe({
      next: () => {
        this.toastr.success('Comment posted successfully.');
        this.commentForm.reset();
        this.getComments(photoId);
      },
      error: (err) => {
        this.errHandler.handleError(err);
      }
    });
  }


  verifyCatUploader(): boolean {
    if (!this.cat() || !this.authService.isAuthenticated()) {
      return false;
    }
    return this.authService.user() === this.cat()!.uploader;
  }


  verifyPhotoUploader(photo: PhotoResponse): boolean {
    if (!photo || !this.authService.isAuthenticated()) {
      return false;
    }
    return this.authService.user() === photo.uploader;
  }


  verifyCommentUploader(comment: any): boolean {
    if (!comment || !this.authService.isAuthenticated()) {
      return false;
    }
    return this.authService.user() === comment.uploader;
  }

  editPhoto(photo: PhotoResponse) {
    const catId = this.cat_id();
    if (!catId || photo.catId !== catId) {
      this.toastr.error('Cat ID is not set.');
      return;
    }
    if (this.editPhotoForm.invalid) {
      this.toastr.error('Description cannot be empty.');
      return;
    }
    const description = this.editPhotoForm.value.description;
    if (!description || description.trim() === '') {
      this.toastr.error('Description cannot be empty.');
      return;
    }
    console.log("edited description: ", description);
    this.updateService.putPhoto(catId, photo.id, photo.title, description).subscribe({
      next: () => {
        this.toastr.success('Photo edited successfully.');
        this.showPhotoEditor.set(-1);
        this.editPhotoForm.reset();
        this.getAllPhotos(catId);
      },
      error: (err) => {
        this.errHandler.handleError(err);
      }
    });
  }


  editComment(photo: PhotoResponse, comment: any) {
    const catId = this.cat_id();
    if (!catId || photo.catId !== catId) {
      this.toastr.error('Cat ID is not set.');
      return;
    }
    const commentText = this.editCommentForm.value.comment;
    if (!commentText || commentText.trim() === '') {
      this.toastr.error('Comment cannot be empty.');
      return;
    }
    console.log("edited comment: ", commentText);
    this.updateService.putComment(catId, photo.id, comment.id, commentText).subscribe({
      next: () => {
        this.toastr.success('Comment edited successfully.');
        this.showCommentEditor.set(-1);
        this.editCommentForm.reset();
        this.getComments(photo.id);
      },
      error: (err) => {
        this.errHandler.handleError(err);
      }
    });
  }


  deleteCat() {
    const catId = this.cat_id();
    if (!catId) {
      this.toastr.error('Cat ID is not set.');
      return;
    }

    this.deleteService.deleteCat(catId).subscribe({
      next: () => {
        this.toastr.success('Cat deleted successfully.');
        this.router.navigateByUrl("/cats");
      },
      error: (err) => {
        this.errHandler.handleError(err);
      }
    });
  }


  deletePhoto(photo: PhotoResponse) {
    const catId = this.cat_id();
    if (!catId) {
      this.toastr.error('Cat ID is not set.');
      return;
    }

    this.deleteService.deleteCatPhoto(catId, photo.id).subscribe({
      next: () => {
        this.toastr.success('Photo deleted successfully.');
        this.getAllPhotos(catId);
      },
      error: (err) => {
        this.errHandler.handleError(err);
      }
    });
  }


  deleteComment(photo: PhotoResponse, comment: any) {
    const catId = this.cat_id();
    if (!catId) {
      this.toastr.error('Cat ID is not set.');
      return;
    }

    this.deleteService.deleteComment(catId, photo.id, comment.id).subscribe({
      next: () => {
        this.toastr.success('Comment deleted successfully.');
        this.getComments(photo.id);
      },
      error: (err) => {
        this.errHandler.handleError(err);
      }
    });
  }
}
