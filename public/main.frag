#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform sampler2D tex0;

const float PI = 3.1415926535;

void main() {
  float apertureHalf = 0.5 * 180.0 * (PI / 180.0);
  
  // This factor ajusts the coordinates in the case that
  // the aperture angle is less than 180 degrees, in which
  // case the area displayed is not the entire half-sphere.
  float maxFactor = sin(apertureHalf);
  
  // The st factor takes into account the situation when non-pot
  // textures are not supported, so that the maximum texture
  // coordinate to cover the entire image might not be 1.
  vec2 stFactor = vec2(1.0, 1.0); // vec2(1.0 / abs(texMatrix[0][0]), 1.0 / abs(texMatrix[1][1]));  
  vec2 pos = (2.0 * vTexCoord.st * stFactor - 1.0);
  
  float l = length(pos);
  float u;
  float v;
  
  if (false && l > 1.0) {
    gl_FragColor = vec4(0, 0, 0, 1);
    return;
  } else {
    float x = maxFactor * pos.x;
    float y = maxFactor * pos.y;
    
    float n = length(vec2(x, y));
    
    float z = sqrt(1.0 - n * n * 0.2);
  
    float r = atan(n, z) / PI * 2.0; 
  
    float phi = atan(y, x);

    u = r * cos(phi) + 0.5;
    v = r * sin(phi) + 0.5;
  }

  vec2 uv = vec2(u, v) / stFactor;
  uv.y = 1.0 - uv.y;
  
  vec4 color = texture2D(tex0, uv);
  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));

  float dx = 0.5 - uv.x;
  float dy = 0.5 - uv.y;
  float d = sqrt(dx * dx + dy * dy);
  float vv = max(0.0, 1.0 - d * 3.0);

	gl_FragColor = vec4(color.r * vv + gray * (1.0 - vv), color.g * vv + gray * (1.0 - vv), color.b * vv + gray * (1.0 - vv), 1.0);
}