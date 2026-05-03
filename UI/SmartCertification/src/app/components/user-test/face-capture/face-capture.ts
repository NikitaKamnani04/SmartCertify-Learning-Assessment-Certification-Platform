import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import * as faceapi from 'face-api.js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-face-capture',
  imports: [FormsModule,CommonModule, RouterModule],
  templateUrl: './face-capture.html',
  styleUrl: './face-capture.css',
})
export class FaceCapture implements OnInit {

  @ViewChild('videoElement') videoElement!: ElementRef;

  videoStream: MediaStream | null = null;
  isFaceDetectionEnabled = false; // 🔥 control switch

  referenceDescriptor: Float32Array | null = null;
  isFaceCaptured = false;
  courseName: string | undefined;
  userName: string | undefined;
  
  constructor(private router: Router,private toastr: ToastrService) {}
  
  async ngOnInit() {
    await this.loadModels();   
    this.startCamera();
  }

  async loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');
  }

  async startCamera() {
  try {
    this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.videoElement.nativeElement.srcObject = this.videoStream;

    // ✅ WAIT until video loads
    await new Promise(resolve => {
      this.videoElement.nativeElement.onloadedmetadata = () => {
        resolve(true);
      };
    });

  } catch (err) {
    alert("Camera permission required");
  }
}

  async captureFace() {
  if (!this.videoElement?.nativeElement) return;

  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize: 416,
    scoreThreshold: 0.5
  });

  const detection = await faceapi
    .detectSingleFace(this.videoElement.nativeElement, options)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    alert("❌ Face not detected properly");
    this.startExam();
    return;
  }
   if (!this.isFaceDetectionEnabled) {
    // 🔥 mock success (for now)
    this.referenceDescriptor = new Float32Array([1, 2, 3]); 
    this.isFaceCaptured = true;

    alert("Face capture skipped (dev mode)");
    return;
  }

  this.referenceDescriptor = detection.descriptor;
  this.isFaceCaptured = true;

  // 🔥 STOP CAMERA (FREEZE)
  this.videoStream?.getTracks().forEach(track => track.stop());

 alert("Face captured successfully!");
}

  retake() {
  this.isFaceCaptured = false;
  this.referenceDescriptor = null;

  // 🔥 Restart camera
  this.startCamera();
}

  startExam() {
  //   console.log("Starting exam with captured face data:", this.referenceDescriptor);
  //   if (!this.referenceDescriptor) {
  //     alert("Please capture face first");
  //     return;
  //   }

  //  sessionStorage.setItem(
  //   'referenceDescriptor',
  //   JSON.stringify(Array.from(this.referenceDescriptor))
  // );

  // 🔥 go to page two (exam details page)
  this.router.navigate(['/exam/details']);
  }
}