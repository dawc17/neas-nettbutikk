import { useState, useCallback, useEffect } from "react";
import { getDatabase, ref, update } from "firebase/database";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FaUser, FaTimes, FaCheck, FaCrop } from "react-icons/fa";

function ProfilePictureUploader({ userId, userData, onProfilePictureUpdate }) {
  // State for profile picture upload/edit
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 80, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imgRef, setImgRef] = useState(null);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [imageError, setImageError] = useState(null);

  // Effect to disable scrolling when modal is open
  useEffect(() => {
    if (showProfilePictureModal) {
      // Save the current overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      
      // Disable scrolling
      document.body.style.overflow = 'hidden';
      
      // Re-enable scrolling when component unmounts or modal closes
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [showProfilePictureModal]);

  // Function to handle image upload
  const handleImageUpload = (e) => {
    setImageError(null);
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Bildet er for stort. Maksimal størrelse er 5MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Function to handle image cropping
  const onImageLoad = useCallback((img) => {
    setImgRef(img);
    // Reset crop when image changes
    setCrop({ unit: '%', width: 80, aspect: 1 });
  }, []);

  // Function to generate cropped image preview
  const getCroppedImg = useCallback(() => {
    if (!imgRef || !completedCrop) return null;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.naturalWidth / imgRef.width;
    const scaleY = imgRef.naturalHeight / imgRef.height;
    const ctx = canvas.getContext('2d');

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      imgRef,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return canvas.toDataURL('image/jpeg');
  }, [imgRef, completedCrop]);

  // Function to save the cropped image
  const handleSaveProfilePicture = async () => {
    const croppedImage = getCroppedImg();
    if (!croppedImage) {
      setImageError("Kunne ikke behandle bildet. Vennligst prøv igjen.");
      return;
    }

    setIsSavingImage(true);
    setImageError(null);

    try {
      const database = getDatabase();
      const userRef = ref(database, `users/${userId}`);

      // Update the profile picture in the user profile
      await update(userRef, {
        profilePicture: croppedImage
      });

      // Notify parent component about the update
      if (onProfilePictureUpdate) {
        await onProfilePictureUpdate(croppedImage); // Wait for the callback to complete
      }

      // Close modal and reset states
      setShowProfilePictureModal(false);
      setUploadedImage(null);
    } catch (err) {
      setImageError("Kunne ikke lagre profilbildet: " + err.message);
    } finally {
      setIsSavingImage(false);
    }
  };

  // Reset crop
  const resetImageEdit = () => {
    setCrop({ unit: '%', width: 80, aspect: 1 });
  };

  // Function to close modal safely
  const closeModal = () => {
    setShowProfilePictureModal(false);
    setUploadedImage(null);
    setImageError(null);
  };

  return (
    <>
      {/* Profile Picture Display */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-mossgreen mb-3 bg-gray-100 flex items-center justify-center">
          {userData.profilePicture ? (
            <img 
              src={userData.profilePicture} 
              alt="Profilbilde" 
              className="object-cover w-full h-full"
            />
          ) : (
            <FaUser className="text-pinegreen text-5xl opacity-50" />
          )}
        </div>
        <button 
          onClick={() => setShowProfilePictureModal(true)}
          className="bg-mossgreen text-pinegreen px-4 py-2 rounded-md hover:bg-mossgreen/80 transition-all font-mabry"
        >
          {userData.profilePicture ? "Endre profilbilde" : "Last opp profilbilde"}
        </button>
      </div>

      {/* Profile Picture Modal */}
      {showProfilePictureModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-mabry text-pinegreen">Last opp profilbilde</h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-pinegreen"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {imageError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                {imageError}
              </div>
            )}

            {!uploadedImage ? (
              <div className="text-center py-8">
                <div className="mb-6">
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="profilePicture"
                    className="bg-mossgreen text-pinegreen py-3 px-6 rounded-md hover:bg-mossgreen/80 transition-all font-mabry cursor-pointer inline-block"
                  >
                    Velg bilde
                  </label>
                  <p className="text-gray-500 mt-2 text-sm">
                    Maks filstørrelse: 5MB. Støttede formater: JPG, PNG, GIF
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-md p-2 overflow-hidden">
                      <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={1}
                      >
                        <img
                          src={uploadedImage}
                          alt="Bilde for redigering"
                          onLoad={(e) => onImageLoad(e.currentTarget)}
                        />
                      </ReactCrop>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between">
                        <button
                          onClick={resetImageEdit}
                          className="flex items-center text-gray-600 hover:text-pinegreen"
                        >
                          Tilbakestill
                        </button>
                        <button
                          onClick={() => setCrop({ unit: '%', width: 100, aspect: 1 })}
                          className="flex items-center text-gray-600 hover:text-pinegreen"
                        >
                          <FaCrop className="mr-1" /> Vis hele bildet
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-64">
                    <h3 className="text-pinegreen font-mabry mb-2">Forhåndsvisning</h3>
                    {completedCrop && (
                      <div>
                        <div className="mb-4">
                          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto border border-gray-300">
                            <img
                              src={getCroppedImg()}
                              alt="Forhåndsvisning av profilbilde"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-4">
                            Dette er hvordan bildet vil se ut som ditt profilbilde
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                    }}
                    className="bg-gray-200 text-pinegreen px-4 py-2 rounded-md hover:bg-gray-300 transition-all mr-2"
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={handleSaveProfilePicture}
                    disabled={!completedCrop || isSavingImage}
                    className={`bg-mossgreen text-pinegreen px-4 py-2 rounded-md hover:bg-mossgreen/80 transition-all flex items-center ${
                      !completedCrop || isSavingImage ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSavingImage ? (
                      <>
                        <span className="mr-2">Lagrer...</span>
                        <div className="animate-spin h-4 w-4 border-2 border-pinegreen rounded-full border-t-transparent"></div>
                      </>
                    ) : (
                      <>
                        <FaCheck className="mr-2" /> Lagre profilbilde
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ProfilePictureUploader;