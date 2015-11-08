# cameno-eq


This project is browser-based utility to align and compare stl files. 

The first step involves applying rigid transformation (translation and rotation only) on the subject .stl 
to align it with the reference .stl. This is done by picking 3 points on both the reference and subject models
in the same order. A least squares estimation is then preformed to best map one set of points to the other and
hence calculate the transformation matrix. The estimation is based on
<a target="_blank" href="http://web.stanford.edu/class/cs273/refs/Absolute-OPT.pdf"> Horn's solution 
of absolute orientation using unit quaternions</a>  and takes some hints from 
<a target="_blank" href="http://www.mathworks.com/matlabcentral/fileexchange/26186-absolute-orientation-horn-s-method">
Matt J's Matlab ABSOR tool</a>.

The second step calculates the surface deviation of the subject from the reference and displays the 
result in the form of a color map accompanied with a legend. This is done by calculating the distance from each
face centroid on the subject mesh to its closest neighbor on the reference mesh. A k-d tree is constructed to 
optimize the search and is loosely based on
<a href="http://threejs.org/examples/#webgl_nearestneighbour" target="_blank">this THREE.js nearest neighbor example</a>.
A more robust method would be to cast rays from each face centroid along the face normal in both directions. 
The distance from the face centroid to the ray intersection points (with the reference mesh) would then give a 
more accurate deviation value.


 While some CAD and STL manipulation packages offer surface deviation tools, aligning is often offered as a surface-wise operation - hence lacking in 3d alignment capabilities. This tool is particularly helpful when comparing geometrically modeled .stl files with scans of their 3d printed versions. The tool can then highlight areas where they are different and hence point out to 3d printing failures that might not always be immediately visible.

A quick screencast of how to use the tool can be found <a href="https://youtu.be/XTTkiUkwN98" target="_blank">here</a> and <a href="https://www.youtube.com/watch?v=wFyetQUi8Yc" target="_blank">here</a>.

Let <a href="http://ahmedhosny.net" target="_blank">me</a> know if you have any thoughts or comments..
