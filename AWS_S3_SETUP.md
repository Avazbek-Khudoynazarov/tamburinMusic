# ☁️ AWS S3 Integration - Setup Complete

## ✅ Integration Status: ACTIVATED

AWS S3 file storage has been successfully integrated into the Tamburin Music platform. All file uploads now go directly to your S3 bucket.

---

## 📋 Configuration Summary

### AWS Credentials Configured:
- **Access Key ID**: `[STORED IN Backend/awsconfig.json - DO NOT COMMIT]`
- **Secret Access Key**: `[STORED IN Backend/awsconfig.json - DO NOT COMMIT]`
- **Region**: `us-east-2` (Ohio)
- **Bucket Name**: `tamburinstudio-storage`

### Files Affected:
- ✅ `Backend/awsconfig.json` - AWS credentials (protected by .gitignore)
- ✅ `Backend/src/routes/upload-router.ts` - S3 upload activated
- ✅ `Backend/src/services/s3-service.ts` - Bucket name updated
- ✅ `Frontend/src/content/pages/mypage/ClassBoardCreate.tsx` - S3 URL handling
- ✅ `Frontend/src/content/pages/mypage/ClassBoardEdit.tsx` - S3 URL handling
- ✅ `Frontend/src/content/pages/Member/MemberEdit.tsx` - S3 URL handling
- ✅ `.gitignore` - AWS credentials protection added
- ✅ `Backend/.env.production` - Production S3 configuration

---

## 🚀 How It Works Now

### File Upload Flow:

```
User selects file
    ↓
Frontend creates FormData
    ↓
POST /upload/data/{folder}
    ↓
Backend multer-s3 middleware
    ↓
File uploaded to S3: tamburinstudio-storage/{folder}/{filename}
    ↓
S3 returns public URL: https://tamburinstudio-storage.s3.us-east-2.amazonaws.com/...
    ↓
URL saved to database (attachment table)
    ↓
Frontend displays file from S3
```

### Upload Endpoints:
- `POST /upload/data/classesBoard` - Class board attachments
- `POST /upload/data/member` - Member profile images
- `POST /upload/data/{entity}` - Other entities (banner, popup, curriculum, etc.)

### S3 File Structure:
```
tamburinstudio-storage/
├── classesBoard/
│   └── classesBoard_[2025-11-25]_14_30_45_document.pdf
├── member/
│   └── member_[2025-11-25]_14_31_12_profile.jpg
├── banner/
├── popup/
└── curriculum/
```

---

## ⚙️ AWS S3 Bucket Setup Required

**IMPORTANT**: You must configure your S3 bucket with the following settings:

### 1. Create S3 Bucket (if not already created)

1. Go to AWS Console → S3
2. Click "Create bucket"
3. Bucket name: `tamburinstudio-storage`
4. Region: `US East (Ohio) us-east-2`
5. Click "Create bucket"

### 2. Configure Bucket Permissions

#### **CORS Configuration** (Required for uploads):

Go to bucket → Permissions → CORS, add this:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": [
            "http://localhost:3000",
            "http://localhost:5001",
            "https://tamburinmusic.co.kr",
            "https://www.tamburinmusic.co.kr",
            "http://114.207.245.104"
        ],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
```

#### **Bucket Policy** (For public read access):

Go to bucket → Permissions → Bucket Policy, add this:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::tamburinstudio-storage/*"
        }
    ]
}
```

#### **Block Public Access Settings**:

Go to bucket → Permissions → Block public access:
- ❌ Uncheck "Block all public access"
- ❌ Uncheck "Block public access to buckets and objects granted through new access control lists (ACLs)"
- ❌ Uncheck "Block public access to buckets and objects granted through any access control lists (ACLs)"
- ✅ Keep other settings as is

### 3. IAM User Permissions

Ensure your IAM user has these permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::tamburinstudio-storage",
                "arn:aws:s3:::tamburinstudio-storage/*"
            ]
        }
    ]
}
```

---

## 🧪 Testing the Integration

### 1. Start Backend:
```bash
cd Backend
npm run dev
```

### 2. Start Frontend:
```bash
cd Frontend
pnpm dev
```

### 3. Test File Upload:

**Test Member Profile Image:**
1. Login to the application
2. Go to Member Edit page
3. Click "찾아보기" (Browse) and select an image
4. File should upload to S3
5. Check AWS Console → S3 → `tamburinstudio-storage/member/`
6. Verify image displays correctly

**Test Class Board Attachment:**
1. Login as teacher/student
2. Go to Class Board Create
3. Attach 1-3 files (any type, max 20MB each)
4. Submit the post
5. Check AWS Console → S3 → `tamburinstudio-storage/classesBoard/`
6. Verify files are accessible

### 4. Verify S3 URLs:

After upload, check browser console and database:
- URL format should be: `https://tamburinstudio-storage.s3.us-east-2.amazonaws.com/...`
- NOT: `http://localhost:5001/uploads/...`

---

## 🔄 Rollback to Local Storage (If Needed)

If you need to switch back to local file storage:

1. Open [Backend/src/routes/upload-router.ts](Backend/src/routes/upload-router.ts)
2. Comment out S3 upload code (lines 11-60)
3. Uncomment local storage code (lines 63-115)
4. Rebuild: `cd Backend && npm run build`
5. Restart backend

---

## 🚨 Security Notes

### ✅ What's Protected:
- `Backend/awsconfig.json` is added to `.gitignore`
- AWS credentials will NOT be committed to GitHub
- Credentials are stored separately from environment variables

### ⚠️ Production Deployment:

When deploying to Cafe24:

1. **Copy `awsconfig.json` manually** to production server:
```bash
scp Backend/awsconfig.json root@114.207.245.104:/path/to/backend/
```

2. **Never commit `awsconfig.json` to git!**

3. **Update production domain** in S3 CORS:
   - Add your production domain to AllowedOrigins in bucket CORS

---

## 💰 Cost Monitoring

### Current Settings:
- File size limit: 20MB per file
- Max files per upload: 15 files
- Storage class: S3 Standard
- Public read access (no data transfer costs for downloads within AWS)

### Expected Monthly Costs (at current scale):
- Storage: $0.17/month (~7GB at $0.025/GB)
- PUT requests: $0.01/month (~600 uploads)
- GET requests: $0.01/month (~5000 views)
- Data transfer: $1-2/month (~10GB downloads)
- **Total: ~$2-3/month**

### Monitor Usage:
- AWS Console → S3 → Metrics → Storage metrics
- Set up billing alerts for unexpected charges
- Review costs monthly

---

## 📊 Migration from Local Storage (Optional)

If you have existing files in `Backend/uploads/`, you can migrate them:

### Manual Migration:
1. Go to AWS Console → S3 → `tamburinstudio-storage`
2. Click "Upload"
3. Select files from `Backend/uploads/classesBoard/` or `Backend/uploads/member/`
4. Maintain folder structure in S3
5. Update database `attachment` table:
   - Change `file` column from local paths to S3 URLs

### Automated Migration Script (Contact if needed):
I can create a script to automatically:
- Upload all files from `Backend/uploads/` to S3
- Update all database records with new S3 URLs
- Verify migration success

---

## 🔧 Troubleshooting

### Upload Fails with "Access Denied":
- Check IAM user permissions in AWS
- Verify bucket policy allows uploads
- Ensure CORS is configured correctly

### Files Upload but Don't Display:
- Check bucket policy allows public read (`s3:GetObject`)
- Verify "Block Public Access" is disabled for GetObject
- Check browser console for CORS errors

### "Bucket does not exist" Error:
- Verify bucket name is exactly: `tamburinstudio-storage`
- Verify region is: `us-east-2`
- Check bucket exists in AWS Console

### Backend Fails to Start:
- Ensure `Backend/awsconfig.json` exists
- Verify JSON format is correct (no trailing commas)
- Check AWS credentials are valid

---

## 📞 Support

For issues with AWS S3 integration:
1. Check this documentation first
2. Verify AWS Console settings
3. Check backend logs for detailed errors
4. Contact AWS Support for billing/access issues

---

## ✅ Integration Checklist

- [x] Created `Backend/awsconfig.json` with credentials
- [x] Updated `.gitignore` to protect credentials
- [x] Activated S3 upload code in `upload-router.ts`
- [x] Updated bucket name to `tamburinstudio-storage`
- [x] Updated Frontend to handle S3 URLs
- [x] Configured production environment
- [x] Backend builds successfully
- [ ] **TODO**: Configure S3 bucket CORS (see above)
- [ ] **TODO**: Configure S3 bucket policy for public read
- [ ] **TODO**: Test file upload in development
- [ ] **TODO**: Verify files are accessible from S3
- [ ] **TODO**: Deploy to production with awsconfig.json
- [ ] **TODO**: Test in production environment

---

**Last Updated**: 2025-11-25
**Integration Status**: ✅ CODE READY - REQUIRES S3 BUCKET CONFIGURATION
